const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
let multerS3 = require("multer-s3");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippets";
const userTableName = "snippy-user";
const storage = multer.memoryStorage();
const s3 = new aws.S3({
  bucket: "snippy.site"
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "snippy.site",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, "userimg/" + file.originalname);
    }
  })
});

router.get("/:userId", async function(req, res, next) {
  try {
    const userId = req.params.userId;
    let params = {
      TableName: tableName,
      ExpressionAttributeNames: {
        "#u": "userId"
      },
      ExpressionAttributeValues: {
        ":u": userId
      },
      FilterExpression: "#u = :u"
    };
    const snippets = await dynamo.scan(params).promise();
    params = {
      TableName: userTableName,
      ExpressionAttributeNames: {
        "#u": "userId"
      },
      ExpressionAttributeValues: {
        ":u": userId
      },
      FilterExpression: "#u = :u"
    };
    const userData = await dynamo.scan(params).promise();
    const result = {
      snippets: {
        userSnippets: snippets.Items,
        favorites: []
      },
      userData: userData.Items[0]
    };
    delete result.userData.password;
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.post("/:user/cards/:cardid/update", async function(req, res, next) {
  try {
    var updateParams = {
      TableName: tableName,
      Key: {
        user: Number(req.params.user),
        cardId: Number(req.params.cardid)
      },
      ExpressionAttributeNames: {
        "#c": "cardData"
      },
      ExpressionAttributeValues: {
        ":c": {
          contents: req.body.contents,
          tags: req.body.tags,
          title: req.body.title
        }
      },
      UpdateExpression: "SET #c = :c"
    };
    const result = await dynamo.update(updateParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.delete("/:user/cards/:cardid/destroy", async function(req, res, next) {
  try {
    var updateParams = {
      TableName: tableName,
      Key: {
        user: Number(req.params.user),
        cardId: Number(req.params.cardid)
      }
    };
    const result = await dynamo.delete(updateParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
router.post("/:id/cards/add", async function(req, res, next) {
  try {
    const user = Number(req.params.id);
    const createdAt = Number(getTimestamp());
    var params = {
      TableName: tableName,
      ExpressionAttributeNames: { "#u": "user", "#ci": "cardId" },
      ExpressionAttributeValues: { ":user": user, ":cardId": 0 },
      KeyConditionExpression: "#u = :user AND #ci >= :cardId"
      // ScanIndexForward: false,
    };
    const userCardData = await dynamo.query(params).promise();
    params = {
      TableName: tableName,
      Item: {
        user: user,
        cardId: Number(userCardData.Count),
        createdAt: createdAt,
        cardType: Number(req.body.cardType),
        cardData: {
          title: req.body.title,
          subTitle: req.body.subTitle,
          contents: req.body.contents,
          tags: req.body.cardTags
        }
      }
    };
    const result = await dynamo.put(params).promise();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router.post("/:userId/changeImg", upload.single("avatar"), async function(req, res) {
  try {
    console.log(req.file.location);
    const updateParams = {
      TableName: userTableName,
      Key: {
        userId: req.params.userId
      },
      ExpressionAttributeNames: {
        "#iu": "imgUrl"
      },
      ExpressionAttributeValues: {
        ":iu": req.file.location
      },
      UpdateExpression: "SET #iu = :iu"
    };
    console.log(updateParams);
    await dynamo.update(updateParams).promise();
    res.json({
      result: "ok"
    });
  } catch (err) {
    res.json({
      result: "ok"
    });
  }
});
// functions
function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function getRandomToken(N) {
  return crypto
    .randomBytes(N)
    .toString("base64")
    .substring(0, N);
}
module.exports = router;
