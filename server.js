/**
 * Module dependencies
 */

const express = require("express");
const bodyParser = require("body-parser");
const { connect, connection } = require("mongoose");

const { dbConnect, logMongoEvents } = require("./helpers/database");
const { UserV1, UserV2 } = require("./models/User");
const { Address } = require("./models/Address");

const app = express();
const PORT = process.env.PORT || 8000;

/**
 * Attach middlewears hear
 *
 */

app.use(bodyParser.json());

/**
 * Initiate Mongo Connection
 *
 */

dbConnect(connect);

logMongoEvents(connection);

/**
 *
 * Routes goes here
 *
 */

/**
 *
 * Create customer with address model nested
 *
 */

app.post("/v1/user", async (req, res) => {
  try {
    const body = req.body;
    let result = await UserV1.create(body);

    //exclude __v from response

    const { __v, ...user } = result.toJSON();

    if (!user) {
      throw new Error("Error while creating user");
    }

    res.status(201).send({
      ...user,
    });
  } catch (error) {
    res.status(501).send({
      msg: error.stack,
    });
  }
});

/**
 *
 * Create customer with address model nested
 *
 */

app.post("/v2/user", async (req, res) => {
  try {
    const { address, ...body } = req.body;
    const { id: adddressId } = await Address.create(address);

    let result = await UserV2.create({ ...body, address: adddressId });

    //exclude __v from response

    const { __v, ...user } = result.toJSON();

    if (!user) {
      throw new Error("Error while creating user");
    }

    res.status(201).send({
      ...user,
    });
  } catch (error) {
    res.status(501).send({
      msg: error.stack,
    });
  }
});

app.get("/v1/users", async (req, res) => {
  try {
    const pageNo = 1;
    const query = req.query;
    const skip = Number(req.query) || 0;
    const limit = Number(query.limit) || 10;
    const pipeline = [];
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { pageNo } }],
        data: [{ $sort: { _id: -1 } }, { $limit: limit }, { $skip: skip }],
      },
    });
    console.log(pipeline);
    const [users] = await UserV1.aggregate(pipeline);
    res.status(200).send({
      ...users,
    });
    if (!users) {
      throw new Error("Error while fetching users :( ");
    }
  } catch (error) {
    console.log("Error ", error.stack);
  }
});

app.get("/v2/users", async (req, res) => {
  try {
    const pageNo = 1;
    const query = req.query;
    const skip = Number(req.query) || 0;
    const limit = Number(query.limit) || 10;
    const pipeline = [];
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { pageNo } }],
        data: [
          {
            $lookup: {
              from: "addresses",
              localField: "address",
              foreignField: "_id",
              as: "address",
            },
          },
          { $sort: { _id: -1 } },
          { $limit: limit },
          { $skip: skip },
        ],
      },
    });
    console.log(pipeline);
    const [users] = await UserV2.aggregate(pipeline);
    res.status(200).send({
      ...users,
    });
    if (!users) {
      throw new Error("Error while fetching users :( ");
    }
  } catch (error) {
    console.log("Error ", error.stack);
  }
});

/**
 * 
 * Using create
 * 
 * 
 * 
 * 
 * 

 let bulkUserPromise = new Array(50).fill(UserV1.create({email:"sagar@gmail.com"}),0,50)

Promise.all(bulkUserPromise)
.then(users => {
  console.log("Users",users)
})
.catch(err =>{
  console.log("err while creating user",err)
})

 */


let bulkUserPromise = new Array(50).fill(0)


bulkUserPromise = bulkUserPromise.map(user =>{
  let document = new UserV1({email:"sagar@gmail.com"})
  return document.save()
   
})

let document = new UserV1({email:"sagar@gmail.com"})

bulkUserPromise.push(document.save())

bulkUserPromise = bulkUserPromise.filter(p=> p.then(res => res)) 


Promise.all(bulkUserPromise.map(p=> p.catch((err)=> 
{ return {err:err, status: "failed"}})))
.then(users => {
  console.log("Users",users)
})
.catch(err =>{
  console.log("err while creating user")
})





/**
 * Fallback route
 *
 */

app.get("*", (req, res) => {
  res.status(200).send(`Oops! you came here`);
});

/**
 *  Start express server
 *
 */

app.listen(PORT, () => {
  console.log(`Server is shining on ${PORT}`);
});

/**
 * Handling uncaught exception
 */

process.on("uncaughtException", function (er) {
  console.error(er.stack);
  process.exit(1);
});

process.on("uncaughtExceptionMonitor", function (err) {
  console.log(err.stack);
  process.exit(1);
});
