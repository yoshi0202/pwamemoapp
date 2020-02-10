const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippet";
const userTableName = "snippy-user";
const pinTableName = "snippy-pin";
const utils = require("../utils/utils");

router.get("/category", async function(req, res, next) {
  try {
    if (!req.query.l) {
      res.json({
        result: "param error"
      });
      return;
    }
    const params = {
      TableName: tableName,
      IndexName: "snipType-createdAt-index",
      KeyConditionExpression: "#st = :st AND #ca >= :ca",
      ExpressionAttributeNames: { "#st": "snipType", "#ca": "createdAt", "#sdt": "snipData", "#tag": "tags" },
      // ExpressionAttributeNames: { "#st": "snipType", "#ca": "createdAt" },
      ExpressionAttributeValues: { ":st": 0, ":ca": 0, ":sdt": req.query.l },
      // ExpressionAttributeValues: { ":st": 0, ":ca": 0 }
      FilterExpression: "contains (#sdt.#tag, :sdt)"
    };
    let result = await dynamo.query(params).promise();
    const userParams = {
      TableName: userTableName
    };
    const getUser = await dynamo.scan(userParams).promise();
    let userData = {};
    getUser.Items.map(function(i) {
      userData[i.userId] = {
        imgUrl: i.imgUrl,
        displayName: i.displayName,
        pin: i.pin
      };
    });
    result.userData = userData;
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
// all snip get
router.get("/", async function(req, res, next) {
  try {
    const params = {
      TableName: tableName,
      IndexName: "snipType-createdAt-index",
      ExpressionAttributeNames: { "#st": "snipType", "#ca": "createdAt" },
      ExpressionAttributeValues: { ":st": 0, ":ca": 0 },
      KeyConditionExpression: "#st = :st AND #ca >= :ca",
      ScanIndexForward: false
    };
    let result = await dynamo.query(params).promise();
    const userParams = {
      TableName: userTableName
    };
    const getUser = await dynamo.scan(userParams).promise();
    let userData = {};
    getUser.Items.map(function(i) {
      userData[i.userId] = {
        imgUrl: i.imgUrl,
        displayName: i.displayName,
        pin: i.pin
      };
    });
    result.userData = userData;
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// snip show
router.get("/:userId/:snipId", async function(req, res, next) {
  try {
    const userId = req.params.userId;
    const snipId = req.params.snipId;
    const params = {
      TableName: tableName,
      ExpressionAttributeNames: { "#u": "userId", "#si": "snipId" },
      ExpressionAttributeValues: { ":u": userId, ":si": snipId },
      KeyConditionExpression: "#u = :u AND #si = :si"
      // ScanIndexForward: false,
    };
    let result = await dynamo.query(params).promise();
    const userParams = {
      TableName: userTableName,
      ExpressionAttributeNames: { "#u": "userId" },
      ExpressionAttributeValues: { ":u": userId },
      KeyConditionExpression: "#u = :u"
    };
    const user = await dynamo.query(userParams).promise();
    result.userData = user.Items[0].imgUrl;
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// snip create
router.post("/add", async function(req, res, next) {
  try {
    const createdAt = Number(utils.getTimestamp());
    const params = {
      TableName: tableName,
      Item: {
        userId: req.body.userId,
        // snipId: Number(req.body.snipCounts),
        snipId: utils.createSnipId(),
        createdAt: createdAt,
        snipType: Number(req.body.snipType),
        snipData: {
          title: req.body.snipTitle,
          contents: req.body.snipContents,
          tags: req.body.snipTags
        }
      }
    };
    const result = await dynamo.put(params).promise();
    // const updateParams = {
    //   TableName: userTableName,
    //   Key: {
    //     userId: req.body.userId
    //   },
    //   ExpressionAttributeNames: {
    //     "#sc": "snipCounts"
    //   },
    //   ExpressionAttributeValues: {
    //     ":sc": Number(req.body.snipCounts) + 1
    //   },
    //   UpdateExpression: "SET #sc = :sc"
    // };
    // await dynamo.update(updateParams).promise();
    // res.json(result);
    res.json({
      result: "ok"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// snip update
router.post("/update", async function(req, res, next) {
  try {
    var updateParams = {
      TableName: tableName,
      Key: {
        userId: req.body.userId,
        snipId: req.body.snipId
      },
      ExpressionAttributeNames: {
        "#s": "snipData",
        "#ca": "createdAt"
      },
      ExpressionAttributeValues: {
        ":s": {
          title: req.body.snipTitle,
          tags: req.body.snipTags,
          contents: req.body.snipContents
        },
        ":ca": Number(utils.getTimestamp())
      },
      UpdateExpression: "SET #s = :s ,#ca = :ca"
    };
    const result = await dynamo.update(updateParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//snip delete
router.delete("/destroy", async function(req, res, next) {
  try {
    const deleteParams = {
      TableName: tableName,
      Key: {
        userId: req.body.userId,
        snipId: req.body.snipId
      }
    };
    const result = await dynamo.delete(deleteParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//snip pin
router.post("/pin", async function(req, res, next) {
  try {
    const putParams = {
      TableName: pinTableName,
      Item: {
        userId: req.body.userId,
        snipId: req.body.snipId,
        snipData: req.body.snipData,
        snipUserId: req.body.snipUserId,
        createdAt: req.body.createdAt,
        userImgUrl: req.body.userImgUrl
      }
    };
    await dynamo.put(putParams).promise();
    res.json({
      result: "ok"
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/pin", async function(req, res, next) {
  try {
    const deleteParams = {
      TableName: pinTableName,
      Key: {
        userId: req.body.userId,
        snipId: req.body.snipId
      }
    };
    const result = await dynamo.delete(deleteParams).promise();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get snip pin status
router.get("/pin", async function(req, res, next) {
  try {
    const scanParams = {
      TableName: pinTableName,
      Key: {
        userId: req.query.userId,
        snipId: req.query.snipId
      }
    };
    const result = await dynamo.get(scanParams).promise();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
