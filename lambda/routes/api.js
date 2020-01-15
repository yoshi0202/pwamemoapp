var express = require("express");
var router = express.Router();
var aws = require("aws-sdk");
var dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "pwaMemoApp";
const userTableName = "snippy-user";
const crypto = require("crypto");
const bcrypt = require("bcrypt");

router.post("/login", async function(req, res, next) {
  try {
    let result = {};
    var params = {
      TableName: userTableName,
      ExpressionAttributeNames: { "#userid": "userid" },
      ExpressionAttributeValues: { ":userid": req.body.email },
      KeyConditionExpression: "#userid = :userid"
    };
    const userData = await dynamo.query(params).promise();
    console.log(userData);
    if (userData.Items.length === 0) {
      // user not defined
      console.log("user not defined");
      result.status = false;
      result.err = "user not defined";
      res.json(result);
      return;
    }
    if (!userData.Items || !bcrypt.compareSync(req.body.password, userData.Items[0].password)) {
      // auth not succcess
      console.log("password is not valid");
      result.status = false;
      result.err = "password is not valid";
      res.json(result);
      return;
    }
    // auth success
    console.log("password is valid");
    result.status = true;
    result.err = "";
    result.loginToken = getRandomToken(32);
    result.id = userData.Items[0].id;
    res.json(result);
    var updateParams = {
      TableName: userTableName,
      Key: {
        userid: req.body.email
      },
      ExpressionAttributeNames: {
        "#l": "loginToken"
      },
      ExpressionAttributeValues: {
        ":l": result.loginToken
      },
      UpdateExpression: "SET #l = :l"
    };
    dynamo.update(updateParams).promise();
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.delete("/logout", async function(req, res, next) {
  try {
    var queryParams = {
      TableName: userTableName,
      ExpressionAttributeNames: { "#userid": "userid", "#loginToken": "loginToken" },
      ExpressionAttributeValues: { ":userid": req.body.userid, ":loginToken": req.body.loginToken },
      KeyConditionExpression: "#userid = :userid",
      FilterExpression: "#loginToken = :loginToken"
    };
    const result = await dynamo.query(queryParams).promise();
    var updateParams = {
      TableName: userTableName,
      Key: {
        userid: req.body.userid
      },
      ExpressionAttributeNames: {
        "#l": "loginToken"
      },
      UpdateExpression: "REMOVE #l"
    };
    await dynamo.update(updateParams).promise();
    console.log(result);
    res.json({
      result: "ok"
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signUp", async function(req, res, next) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const loginToken = getRandomToken(32);
    let params = {
      TableName: userTableName
    };
    const scanResult = await dynamo.scan(params).promise();
    params.Item = {
      userid: req.body.email,
      password: hashedPassword,
      loginToken: loginToken,
      id: scanResult.Count
    };
    await dynamo.put(params).promise();
    res.json({
      status: true,
      loginToken: loginToken,
      userId: req.body.email,
      id: scanResult.Count
    });
  } catch (err) {
    res.json(err);
  }
});

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
    console.log(params);
    const result = await dynamo.query(params).promise();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.post("/:id/cards/:cardid/thumbtack", async function(req, res, next) {
  try {
  } catch (err) {}
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

function getRandomToken(N) {
  return crypto
    .randomBytes(N)
    .toString("base64")
    .substring(0, N);
}
module.exports = router;
