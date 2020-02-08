const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1", convertEmptyValues: true });
const tableName = "snippy-category";

router.get("/categories", async function(req, res, next) {
  try {
    let params = {
      TableName: tableName
    };
    const category = await dynamo.scan(params).promise();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
