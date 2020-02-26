const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const algoliasearch = require("algoliasearch");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const tableName = "snippy-snippet";
const userTableName = "snippy-user";
const pinTableName = "snippy-pin";
const utils = require("../utils/utils");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex("snippets");

// all snip get
router.get("/", async function(req, res, next) {
  try {
    let indexName = "snipType-createdAt-index";
    let sortKey = "createdAt";
    if (Number(req.query.sort) === 1) {
      indexName = "snipType-pinCounts-index";
      sortKey = "pinCounts";
    }
    if (Number(req.query.sort) === 2) {
      indexName = "snipType-viewCounts-index";
      sortKey = "viewCounts";
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
    result.userData = {
      imgUrl: user.Items[0].imgUrl,
      displayName: user.Items[0].displayName
    };
    res.json(result);
    incrementViewCounts(userId, snipId);
    updateViewedAt(userId, snipId);
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
    index.saveObjects([
      {
        objectID: req.body.userId + "_" + snipId,
        ...params.Item
      }
    ]);
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
    let updateParams = {
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
    index.partialUpdateObject({
      objectID: req.body.userId + "_" + req.body.snipId,
      snipData: {
        ...updateParams.ExpressionAttributeValues[":s"]
      },
      ...updateParams.ExpressionAttributeValues[":ca"]
    });
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
    decrementSnipCounts(req.body.userId);
    index.deleteObjects([req.body.userId + "_" + req.body.snipId]);
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
        userImgUrl: req.body.userImgUrl,
        pinFlg: 1
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

async function decrementSnipCounts(userId) {
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
        UpdateExpression: "SET #s = #s - :s, #p = :p"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}

async function updateViewedAt(userId, snipId) {
  return new Promise(async function(res, rej) {
    try {
      const params = {
        TableName: tableName,
        Key: {
          userId: userId,
          snipId: snipId
        },
        ExpressionAttributeValues: {
          ":v": utils.getTimestamp()
        },
        ExpressionAttributeNames: {
          "#v": "viewedAt"
        },
        UpdateExpression: "SET #v = :v"
      };
      await dynamo.update(params).promise();
      res("");
    } catch (err) {
      rej(err);
    }
  });
}
