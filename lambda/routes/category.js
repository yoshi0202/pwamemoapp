const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1", convertEmptyValues: true });
const tableName = "snippy-category";

router.get("/categories", async function(req, res, next) {
  try {
    const params = {
      TableName: tableName,
      IndexName: "type-sortKey-index",
      ExpressionAttributeNames: { "#t": "type", "#s": "sortKey" },
      ExpressionAttributeValues: { ":t": 0, ":s": 0 },
      KeyConditionExpression: "#t = :t AND #s >= :s",
      ScanIndexForward: true
    };
    const category = await dynamo.query(params).promise();
    res.json(category);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

module.exports = router;
