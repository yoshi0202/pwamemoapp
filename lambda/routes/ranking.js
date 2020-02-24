const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippet";
const userTableName = "snippy-user";
const pinTableName = "snippy-pin";
const utils = require("../utils/utils");

router.get("/snipCounts", async function(req, res, next) {
  try {
    let params = {
      TableName: userTableName,
      IndexName: "activate-snipCounts-index",
      ExpressionAttributeNames: { "#a": "activate", "#s": "snipCounts" },
      ExpressionAttributeValues: { ":a": 1, ":s": 0 },
      KeyConditionExpression: "#a = :a AND #s > :s",
      ScanIndexForward: false,
      Limit: 5
    };
    const result = await dynamo.query(params).promise();
    res.json(result);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});
router.get("/currentryViewed", async function(req, res, next) {
  try {
    let params = {
      TableName: tableName,
      IndexName: "snipType-viewedAt-index",
      ExpressionAttributeNames: { "#s": "snipType", "#v": "viewedAt" },
      ExpressionAttributeValues: { ":s": 0, ":v": 0 },
      KeyConditionExpression: "#s = :s AND #v > :v",
      ScanIndexForward: false,
      Limit: 5
    };
    const result = await dynamo.query(params).promise();
    console.log(result);
    res.json(result);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});
router.get("/currentryPin", async function(req, res, next) {
  try {
    let params = {
      TableName: pinTableName,
      IndexName: "pinFlg-pinCreatedAt-index",
      ExpressionAttributeNames: { "#pf": "pinFlg", "#pc": "pinCreatedAt" },
      ExpressionAttributeValues: { ":pf": 1, ":pc": 0 },
      KeyConditionExpression: "#pf = :pf AND #pc > :pc",
      ScanIndexForward: false,
      Limit: 5
    };
    const result = await dynamo.query(params).promise();
    res.json(result);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

module.exports = router;
