const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const algoliasearch = require("algoliasearch");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1", convertEmptyValues: true });
const tableName = "snippy-snippet";
const userTableName = "snippy-user";
const pinTableName = "snippy-pin";
const notifyTableName = "snippy-notification";
const utils = require("../utils/utils");
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex("snippets");
let Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap3",
  useTLS: true
});

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
    result.Items.map(function(v) {
      delete v.snipData.contents;
    });
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
    await incrementViewCounts(userId, snipId);
    await updateViewedAt(userId, snipId);
    res.json(result);
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
    let delArray = [];
    let delParams = {};

    // delete snip tables
    const deleteParams = {
      TableName: tableName,
      Key: {
        userId: req.body.userId,
        snipId: req.body.snipId
      }
    };
    delArray.push(dynamo.delete(deleteParams).promise());

    // delete pin tables
    let queryParams = {
      TableName: pinTableName,
      IndexName: "snipUserId-snipId-index",
      ExpressionAttributeNames: { "#sui": "snipUserId", "#s": "snipId" },
      ExpressionAttributeValues: { ":sui": req.body.userId, ":s": req.body.snipId },
      KeyConditionExpression: "#sui = :sui AND #s = :s"
    };
    const pinGetResult = await dynamo.query(queryParams).promise();

    pinGetResult.Items.map(function(v) {
      delParams = {
        TableName: pinTableName,
        Key: {
          userId: v.userId,
          snipId: v.snipId
        }
      };
      delArray.push(dynamo.delete(delParams).promise());
    });

    // delete notification Tables
    let scanParams = {
      TableName: notifyTableName,
      ExpressionAttributeNames: { "#s": "snipId" },
      ExpressionAttributeValues: { ":s": req.body.snipId },
      FilterExpression: "#s = :s"
    };
    const notifyGetResult = await dynamo.scan(scanParams).promise();
    console.log(notifyGetResult);

    notifyGetResult.Items.map(function(v) {
      delParams = {
        TableName: notifyTableName,
        Key: {
          userId: v.userId,
          createdAt: v.createdAt
        }
      };
      delArray.push(dynamo.delete(delParams).promise());
    });

    // delete All Tables
    await Promise.all(delArray);

    // delete algolia
    if (Number(req.body.snipType) !== 1) {
      decrementSnipCounts(req.body.userId);
      index.deleteObjects([req.body.userId + "_" + req.body.snipId]);
    }
    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

//add snip pin
router.post("/pin", async function(req, res, next) {
  try {
    let promiseArray = [];

    // increments pin counts
    await incrementPinCounts(req.body.snipUserId, req.body.snipId);

    // add pin
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
    promiseArray.push(dynamo.put(putParams).promise());

    if (req.body.snipUserId !== req.body.userId) {
      //update notification, not own event
      const notiParams = {
        TableName: notifyTableName,
        Item: {
          userId: req.body.snipUserId,
          event: "pin",
          eventUserId: req.body.userId,
          snipId: req.body.snipId,
          createdAt: Number(utils.getTimestamp())
        }
      };
      promiseArray.push(dynamo.put(notiParams).promise());
    }

    // update user notifyFlg
    let updateUserNotify = {
      TableName: userTableName,
      Key: {
        userId: req.body.snipUserId
      },
      ExpressionAttributeValues: {
        ":n": 1
      },
      ExpressionAttributeNames: {
        "#n": "notifyFlg"
      },
      UpdateExpression: "SET #n = :n"
    };
    promiseArray.push(dynamo.update(updateUserNotify).promise());

    await Promise.all(promiseArray);

    // send notification using websocket
    await sendSocket("notiChannel", "pinAdd-event", { id: req.body.snipUserId });

    res.json({
      result: "ok"
    });
  } catch (err) {
    next(utils.createErrorObj(500, err));
  }
});

router.delete("/pin", async function(req, res, next) {
  try {
    let promiseArray = [];

    // decrement pin counts
    await decrementPinCounts(req.body.snipUserId, req.body.snipId);

    // delete pin
    const deleteParams = {
      TableName: pinTableName,
      Key: {
        userId: req.body.userId,
        snipId: req.body.snipId
      }
    };
    promiseArray.push(dynamo.delete(deleteParams).promise());

    // search notification table
    let params = {
      TableName: notifyTableName,
      ExpressionAttributeNames: {
        "#e": "eventUserId",
        "#s": "snipId"
      },

      ExpressionAttributeValues: {
        ":e": req.body.userId,
        ":s": req.body.snipId
      },
      FilterExpression: "#e = :e AND #s = :s"
    };
    let notify = await dynamo.scan(params).promise();

    if (notify.Items.length !== 0) {
      // delete notification
      params = {
        TableName: notifyTableName,
        Key: {
          userId: notify.Items[0].userId,
          createdAt: notify.Items[0].createdAt
        }
      };
      promiseArray.push(dynamo.delete(params).promise());
    }

    await Promise.all(promiseArray);
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

// memo create
router.post("/addMemo", async function(req, res, next) {
  try {
    const createdAt = Number(utils.getTimestamp());
    const snipId = req.body.snipId || utils.createSnipId();
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
    res.json({
      result: "ok"
    });
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

function sendSocket(channel, event, data) {
  return new Promise(function(rej, res) {
    pusher.trigger(channel, event, data, function(err) {
      if (err) res(err);
      else rej("");
    });
  });
}
