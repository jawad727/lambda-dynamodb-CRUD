'use strict';
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" })
const uuid = require("uuid/v4")

const postsTable = process.env.POSTS_TABLE;

// create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}

function sortByDate(a, b) {
  if (a.PostTime > b.PostTime) {
    return -1
  } else return 1;
}

// create a post
module.exports.createPost = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)

  const post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    DisplayName: reqBody.DisplayName,
    Email: reqBody.Email,
    UID: reqBody.UID,
    StoreName: reqBody.StoreName,
    StoreLocation: reqBody.StoreLocation,
    StorePhoneNumber: reqBody.StorePhoneNumber,
    StoreGoogleRating: reqBody.StoreGoogleRating,
    StoreWebsite: reqBody.StoreWebsite,
    text: reqBody.text,
    upVote: reqBody.upVote
  }

  return db.put({
    TableName: postsTable,
    Item: post
  }).promise().then(() => {
    callback(null, response(201, post))
  })
  .catch(err => response(null, response(err.statusCode, err)));
}

// get all posts
module.exports.getAllPosts = (event, context, callback) => {
  return db.scan({
    TableName: postsTable
  }).promise()
  .then(res => {
    callback(null, response(201, res.Items))
  }).catch(err => callback(null, response(err.statusCode, err)))
}

// Get number of posts
module.exports.getPosts = (event, context, callback) => {
  const numberOfPosts = event.pathParameters.number;
  const params = {
    TableName: postsTable,
    Limit: numberOfPosts
  }
  return db.scan(params)
  .promise()
  .then(res => {
    callback(null, response(200, res.Items))
  }).catch(err => callback(null, response(err.statusCode, err)))
}

// Get a single post
module.exports.getPost = (event, context, callback) => {
  const theuser = event.pathParameters.uid;
  const params = {
    
    ExpressionAttributeNames: {
      "#userid": "UID"
    },
    ExpressionAttributeValues: {
      ":userid": theuser
    },
    FilterExpression: "#userid = :userid",
    TableName: postsTable
  }

  return db.scan(params)
  .promise()
  .then(res => {
    callback(null, response(200, res.Items))
  }).catch(err => callback(null, response(err.statusCode, err)))
}

// Update a post
module.exports.updatePost = (event, context, callback) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  const params = {
    Key: {
      id: id
    },
    TableName: postsTable,
    ConditionExpression: "attribute_exists(id)",
    UpdateExpression: "set " + paramName + " = :v",
    ExpressionAttributeValues: {
      ":v": paramValue 
    },
    ReturnValue: "ALL_NEW"
  }

  return db.update(params)
  .promise()
  .then(res => {
    callback(null, response(200, res))
  })
  .catch(err => callback(null, response(err.statusCode, err)))
}

// Delete a post
module.exports.deletePost = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id
    },
    TableName: postsTable
  }
  return db.delete(params)
  .promise()
  .then(() => callback(null, response(200, { message: "post deleted successfully" })))
  .catch(err => callback(null, response(err.statusCode, err)))
}