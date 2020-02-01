const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippets";
const userTableName = "snippy-user";
const utils = require("../utils/utils");

// all snip get
router.get("/", async function(req, res, next) {
  try {
    var params = {
      TableName: tableName,
      IndexName: "snipType-createdAt-index",
      ExpressionAttributeNames: { "#st": "snipType", "#ca": "createdAt" },
      ExpressionAttributeValues: { ":st": 0, ":ca": 0 },
      KeyConditionExpression: "#st = :st AND #ca >= :ca",
      ScanIndexForward: false
    };
    const result = await dynamo.query(params).promise();
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
    const snipId = Number(req.params.snipId);
    var params = {
      TableName: tableName,
      ExpressionAttributeNames: { "#u": "userId", "#si": "snipId" },
      ExpressionAttributeValues: { ":u": userId, ":si": snipId },
      KeyConditionExpression: "#u = :u AND #si = :si"
      // ScanIndexForward: false,
    };
    const result = await dynamo.query(params).promise();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// snip create
router.post("/add", async function(req, res, next) {
  try {
    console.log(req.body);
    const createdAt = Number(utils.getTimestamp());
    const params = {
      TableName: tableName,
      Item: {
        userId: req.body.userId,
        snipId: Number(req.body.snipCounts),
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
    const updateParams = {
      TableName: userTableName,
      Key: {
        userId: req.body.userId
      },
      ExpressionAttributeNames: {
        "#sc": "snipCounts"
      },
      ExpressionAttributeValues: {
        ":sc": Number(req.body.snipCounts) + 1
      },
      UpdateExpression: "SET #sc = :sc"
    };
    await dynamo.update(updateParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// snip update
router.post("/update", async function(req, res, next) {
  try {
    var updateParams = {
      TableName: tableName,
      Key: {
        userId: req.body.userId,
        snipId: Number(req.body.snipId)
      },
      ExpressionAttributeNames: {
        "#s": "snipData"
      },
      ExpressionAttributeValues: {
        ":s": {
          title: req.body.snipTitle,
          tags: req.body.snipTags,
          contents: req.body.snipContents
        }
      },
      UpdateExpression: "SET #s = :s"
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
        snipId: Number(req.body.snipId)
      }
    };
    const result = await dynamo.delete(deleteParams).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = router;
