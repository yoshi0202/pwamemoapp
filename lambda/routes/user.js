const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const crypto = require("crypto");
const utils = require("../utils/utils");
const multer = require("multer");
let multerS3 = require("multer-s3");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1", convertEmptyValues: true });
const tableName = "snippy-snippet";
const userTableName = "snippy-user";
const pinTableName = "snippy-pin";
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
    params = {
      TableName: pinTableName,
      ExpressionAttributeNames: {
        "#u": "userId"
      },
      ExpressionAttributeValues: {
        ":u": userId
      },
      FilterExpression: "#u = :u"
    };
    const pinData = await dynamo.scan(params).promise();
    const result = {
      snippets: {
        userSnippets: snippets.Items,
        pins: pinData.Items
      },
      userData: userData.Items[0]
    };
    delete result.userData.password;
    res.json(result);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

router.post("/:userId/profile/update", async function(req, res, next) {
  try {
    const updateParams = setUpdateUserParams(req.params.userId, req.body);
    const result = await dynamo.update(updateParams).promise();
    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
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
    next(utils.createErrorObj(500, err));
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
function setUpdateUserParams(userId, data) {
  return {
    TableName: userTableName,
    Key: {
      userId: userId
    },
    ExpressionAttributeNames: {
      "#dn": "displayName",
      "#d": "description",
      "#u": "url",
      "#t": "twitter",
      "#g": "github",
      "#q": "qiita"
    },
    ExpressionAttributeValues: {
      ":dn": data.displayName,
      ":d": data.description,
      ":u": data.url,
      ":t": data.twitter,
      ":g": data.github,
      ":q": data.qiita
    },
    UpdateExpression: "SET #dn = :dn ,  #d = :d , #u = :u , #t = :t , #g = :g , #q = :q"
  };
}
module.exports = router;
