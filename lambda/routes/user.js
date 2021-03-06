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
const notifyTableName = "snippy-notification";
const storage = multer.memoryStorage();
const s3 = new aws.S3({
  bucket: "snippy.site",
  region: "ap-northeast-1",
  signatureVersion: "v4"
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
      ExpressionAttributeNames: { "#u": "userId", "#c": "createdAt", "#s": "snipType" },
      ExpressionAttributeValues: { ":u": userId, ":c": 0, ":s": 0 },
      KeyConditionExpression: "#u = :u AND #c >= :c",
      FilterExpression: "#s = :s",
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
    params = {
      TableName: tableName,
      IndexName: "userId-createdAt-index",
      ExpressionAttributeNames: { "#u": "userId", "#c": "createdAt", "#s": "snipType" },
      ExpressionAttributeValues: { ":u": userId, ":c": 0, ":s": 1 },
      KeyConditionExpression: "#u = :u AND #c >= :c",
      FilterExpression: "#s = :s",
      ScanIndexForward: false
    };
    promiseArray.push(dynamo.query(params).promise());
    const promiseAll = await Promise.all(promiseArray);
    let result = {
      snippets: {
        userSnippets: promiseAll[0].Items,
        pins: [],
        userMemo: promiseAll[3].Items
      },
      userData: promiseAll[1].Items[0]
    };
    delete result.userData.password;
    result.snippets.userSnippets.map(function(v) {
      delete v.snipData.contents;
    });

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

router.get("/:userId/getUploadUrl", async function(req, res, next) {
  try {
    const createdAt = Number(utils.getTimestamp());
    const uploadUrl = await s3.getSignedUrl("putObject", {
      Bucket: "snippy.site",
      Key: "userimg/" + req.params.userId + "_" + createdAt + "." + req.query.fileExtension,
      Expires: 60,
      ContentType: req.query.contentType
    });
    res.json({
      uploadUrl: uploadUrl
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});
router.get("/:userId/notification", async function(req, res, next) {
  try {
    let params = {
      TableName: notifyTableName,
      ExpressionAttributeNames: { "#u": "userId", "#c": "createdAt" },
      ExpressionAttributeValues: { ":u": req.params.userId, ":c": 0 },
      KeyConditionExpression: "#u = :u AND #c >= :c",
      ScanIndexForward: false
    };
    const result = await dynamo.query(params).promise();
    let promiseArray = [];
    let promiseArray2 = [];
    result.Items.map(function(v) {
      params = {
        TableName: tableName,
        Key: {
          userId: v.userId,
          snipId: v.snipId
        }
      };
      promiseArray.push(dynamo.get(params).promise());
      delete params.Key.snipId;
      params.TableName = userTableName;
      params.Key.userId = v.eventUserId;
      promiseArray2.push(dynamo.get(params).promise());
    });
    const promiseAll = await Promise.all(promiseArray);
    const promiseAll2 = await Promise.all(promiseArray2);
    let resultArray = [];
    result.Items.map(function(v, i) {
      resultArray.push({
        createdAt: v.createdAt,
        eventUserId: v.eventUserId,
        snipId: v.snipId,
        displayName: promiseAll2[i].Item.displayName,
        eventUserImgUrl: promiseAll2[i].Item.imgUrl,
        snipTitle: promiseAll[i].Item.snipData.title
      });
    });

    // update notification flg at user
    const userParams = {
      TableName: userTableName,
      Key: {
        userId: req.params.userId
      },
      ExpressionAttributeValues: {
        ":n": 0
      },
      ExpressionAttributeNames: {
        "#n": "notifyFlg"
      },
      UpdateExpression: "SET #n = :n"
    };
    await dynamo.update(userParams).promise();

    res.json(resultArray);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

router.post("/:userId/changeImg", async function(req, res) {
  const updateParams = {
    TableName: userTableName,
    Key: {
      userId: req.params.userId
    },
    ExpressionAttributeNames: {
      "#iu": "imgUrl"
    },
    ExpressionAttributeValues: {
      ":iu": req.body.url
    },
    UpdateExpression: "SET #iu = :iu"
  };
  await dynamo.update(updateParams).promise();
  res.json({
    result: "ok"
  });
});

router.get("/:userId/unreadNotify", async function(req, res) {
  const getParam = {
    TableName: userTableName,
    Key: {
      userId: req.params.userId
    }
  };
  let result = await dynamo.get(getParam).promise();
  let returnObj = {
    bool: result.Item.notifyFlg === 1 ? true : false
  };
  res.json(returnObj);
});
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
