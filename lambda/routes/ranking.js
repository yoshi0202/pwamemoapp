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
    let promiseArray = [];
    let returnObj = {
      snip: result.Items,
      user: []
    };
    let userParams = {
      TableName: userTableName,
      ExpressionAttributeNames: { "#u": "userId" },
      KeyConditionExpression: "#u = :u"
    };
    result.Items.map(ri => {
      userParams.ExpressionAttributeValues = {
        ":u": ri.userId
      };
      promiseArray.push(dynamo.query(userParams).promise());
    });
    const promiseAll = await Promise.all(promiseArray);
    promiseAll.map(pa => {
      returnObj.user.push(pa.Items[0]);
    });
    res.json(returnObj);
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
    let promiseArray = [];
    let promiseArray2 = [];
    let returnObj = {
      snip: [],
      user: []
    };
    result.Items.map(ri => {
      promiseArray.push(
        dynamo
          .get({
            TableName: tableName,
            Key: {
              userId: ri.snipUserId,
              snipId: ri.snipId
            }
          })
          .promise()
      );
      promiseArray2.push(
        dynamo
          .get({
            TableName: userTableName,
            Key: {
              userId: ri.snipUserId
            }
          })
          .promise()
      );
    });
    const promiseAll = await Promise.all(promiseArray);
    const promiseAll2 = await Promise.all(promiseArray2);
    promiseAll.map((pa, i) => {
      returnObj.snip.push(pa.Item);
      returnObj.snip[i].imgUrl = promiseAll2[i].Item.imgUrl;
    });
    res.json(returnObj);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

module.exports = router;
