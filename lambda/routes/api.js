var express = require("express");
var router = express.Router();
var aws = require("aws-sdk");
var dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "pwaMemoApp";

router.get("/cards", async function(req, res, next) {
  try {
    var params = {
      TableName: tableName,
      IndexName: "cardType-createdAt-index",
      ExpressionAttributeNames: { "#ct": "cardType", "#ca": "createdAt" },
      ExpressionAttributeValues: { ":cardType": 0, ":createdAt": 0 },
      KeyConditionExpression: "#ct = :cardType AND #ca >= :createdAt",
      ScanIndexForward: false
    };
    const result = await dynamo.query(params).promise();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id/cards", async function(req, res, next) {
  try {
    const user = Number(req.params.id);
    var params = {
      TableName: tableName,
      ExpressionAttributeNames: { "#u": "user", "#ci": "cardId" },
      ExpressionAttributeValues: { ":user": user, ":cardId": 0 },
      KeyConditionExpression: "#u = :user AND #ci >= :cardId"
      // ScanIndexForward: false,
    };
    const result = await dynamo.query(params).promise();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id/cards/:cardId", async function(req, res, next) {
  try {
    const user = Number(req.params.id);
    const cardId = Number(req.params.cardId);
    var params = {
      TableName: tableName,
      Key: {
        user: user,
        cardId: cardId
      }
    };
    const result = await dynamo.get(params).promise();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router.post("/:id/cards/add", async function(req, res, next) {
  try {
    const user = Number(req.params.id);
    const createdAt = Number(getTimestamp());
    // console.log(JSON.stringify(req.body));
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
    console.log(params);
    const result = await dynamo.put(params).promise();
    res.json(result);
    // res.json({
    //   result: "ok"
    // });
  } catch (err) {
    res.json(err);
  }
});

// functions
function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}
module.exports = router;
