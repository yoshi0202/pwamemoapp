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
// all snip get
router.get("/", async function(req, res, next) {
  try {
    let indexName = "";
    let sortKey = "";
    switch (req.query.sort) {
      case "New Snippets":
        indexName = "snipType-createdAt-index";
        sortKey = "createdAt";
        break;

      case "Most Viewd":
        indexName = "snipType-viewCounts-index";
        sortKey = "viewCounts";
        break;

      case "Most Pin Counts":
        indexName = "snipType-pinCounts-index";
        sortKey = "pinCounts";
        break;

      default:
        // query param error
        throw new Error("SortKey Parameter Error");
        break;
    }
    let params = {
      TableName: tableName,
      IndexName: indexName,
      ExpressionAttributeNames: { "#st": "snipType", "#s": sortKey },
      ExpressionAttributeValues: { ":st": 0, ":s": 0 },
      KeyConditionExpression: "#st = :st AND #s >= :s",
      ScanIndexForward: false
    };
    if (req.query.category) {
      params.ExpressionAttributeNames["#tag"] = "tags";
      params.ExpressionAttributeNames["#sdt"] = "snipData";
      params.ExpressionAttributeValues[":sdt"] = req.query.category;
      params.FilterExpression = "contains (#sdt.#tag, :sdt)";
    }
    const result = await dynamo.query(params).promise();
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
    next(utils.createErrorObj(500, err));
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
    console.log(user);
    result.userData = {
      imgUrl: user.Items[0].imgUrl,
      displayName: user.Items[0].displayName
    };
    res.json(result);
    incrementViewCounts(userId, snipId);
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

// snip create
router.post("/add", async function(req, res, next) {
  try {
    const createdAt = Number(utils.getTimestamp());
    const snipId = utils.createSnipId();
    const params = {
      TableName: tableName,
      Item: {
        userId: req.body.userId,
        snipId: snipId,
        createdAt: createdAt,
        snipType: Number(req.body.snipType),
        snipData: {
          title: req.body.snipTitle,
          contents: req.body.snipContents,
          tags: req.body.snipTags,
          snippets: req.body.snippets
        },
        pinCounts: 0,
        viewCounts: 0
      }
    };
    await dynamo.put(params).promise();
    incrementSnipCounts(req.body.userId);
    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
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
          contents: req.body.snipContents || "",
          snippets: req.body.snippets || ""
        },
        ":ca": Number(utils.getTimestamp())
      },
      UpdateExpression: "SET #s = :s ,#ca = :ca"
    };
    const result = await dynamo.update(updateParams).promise();
    res.json(result);
  } catch (err) {
    next(utils.createErrorObj(500, err));
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
    next(utils.createErrorObj(500, err));
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
        pinCreatedAt: Number(utils.getTimestamp()),
        userImgUrl: req.body.userImgUrl
      }
    };
    await dynamo.put(putParams).promise();
    incrementPinCounts(req.body.snipUserId, req.body.snipId);
    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
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
    await dynamo.delete(deleteParams).promise();
    await decrementPinCounts(req.body.snipUserId, req.body.snipId);
    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
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
    next(utils.createErrorObj(500, err));
  }
});

module.exports = router;

async function incrementPinCounts(userId, snipId) {
  return new Promise(async function(res, rej) {
    try {
      const params = {
        TableName: tableName,
        Key: {
          userId: userId,
          snipId: snipId
        },
        ExpressionAttributeValues: {
          ":p": 1
        },
        ExpressionAttributeNames: {
          "#p": "pinCounts"
        },
        UpdateExpression: "SET #p = #p + :p"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}

async function decrementPinCounts(userId, snipId) {
  return new Promise(async function(res, rej) {
    try {
      const params = {
        TableName: tableName,
        Key: {
          userId: userId,
          snipId: snipId
        },
        ExpressionAttributeValues: {
          ":p": 1
        },
        ExpressionAttributeNames: {
          "#p": "pinCounts"
        },
        UpdateExpression: "SET #p = #p - :p"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}

async function incrementViewCounts(userId, snipId) {
  return new Promise(async function(res, rej) {
    try {
      const params = {
        TableName: tableName,
        Key: {
          userId: userId,
          snipId: snipId
        },
        ExpressionAttributeValues: {
          ":v": 1
        },
        ExpressionAttributeNames: {
          "#v": "viewCounts"
        },
        UpdateExpression: "SET #v = #v + :v"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}

async function incrementSnipCounts(userId) {
  return new Promise(async function(res, rej) {
    try {
      const params = {
        TableName: userTableName,
        Key: {
          userId: userId
        },
        ExpressionAttributeValues: {
          ":s": 1,
          ":p": 1
        },
        ExpressionAttributeNames: {
          "#s": "snipCounts",
          "#p": "post"
        },
        UpdateExpression: "SET #s = #s + :s, #p = :p"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}
