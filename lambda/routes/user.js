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
    let promiseArray = [];
    const userId = req.params.userId;
    let params = {
      TableName: tableName,
      IndexName: "userId-createdAt-index",
      ExpressionAttributeNames: { "#u": "userId", "#c": "createdAt" },
      ExpressionAttributeValues: { ":u": userId, ":c": 0 },
      KeyConditionExpression: "#u = :u AND #c >= :c",
      ScanIndexForward: false
    };
    promiseArray.push(dynamo.query(params).promise());
    let userParams = {
      TableName: userTableName,
      ExpressionAttributeNames: {
        "#u": "userId"
      },
      ExpressionAttributeValues: {
        ":u": userId
      },
      FilterExpression: "#u = :u"
    };
    promiseArray.push(dynamo.scan(userParams).promise());
    let pinParams = {
      TableName: pinTableName,
      ExpressionAttributeNames: {
        "#u": "userId"
      },
      ExpressionAttributeValues: {
        ":u": userId
      },
      FilterExpression: "#u = :u"
    };
    promiseArray.push(dynamo.scan(pinParams).promise());
    const promiseAll = await Promise.all(promiseArray);
    let result = {
      snippets: {
        userSnippets: promiseAll[0].Items,
        pins: []
      },
      userData: promiseAll[1].Items[0]
    };
    delete result.userData.password;

    let promiseArray2 = [];
    let promiseArray3 = [];
    promiseAll[2].Items.map(pa => {
      promiseArray2.push(
        dynamo
          .get({
            TableName: tableName,
            Key: {
              userId: pa.snipUserId,
              snipId: pa.snipId
            }
          })
          .promise()
      );
      promiseArray3.push(
        dynamo
          .get({
            TableName: userTableName,
            Key: {
              userId: pa.snipUserId
            }
          })
          .promise()
      );
    });
    const promiseAll2 = await Promise.all(promiseArray2);
    const promiseAll3 = await Promise.all(promiseArray3);
    promiseAll2.map((pa, i) => {
      result.snippets.pins.push(pa.Item);
      result.snippets.pins[i].userImgUrl = promiseAll3[i].Item.imgUrl;
    });
    console.log(result);
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
    await dynamo.update(updateParams).promise();
    res.json({
      result: "ok",
      imageUrl: req.file.location
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
