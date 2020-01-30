const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippets";
const userTableName = "snippy-user";

router.get("/:userId/cards", async function(req, res, next) {
  try {
    const userId = req.params.userId;
    var params = {
      TableName: tableName,
      IndexName: "userId-createdAt-index",
      ExpressionAttributeNames: { "#u": "userId", "#ca": "createdAt" },
      ExpressionAttributeValues: { ":u": userId, ":ca": 0 },
      KeyConditionExpression: "#u = :u AND #ca >= :ca",
      ScanIndexForward: false
    };
    console.log(params);
    const result = await dynamo.query(params).promise();
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
