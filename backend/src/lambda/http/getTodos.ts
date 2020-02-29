import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { JsonWebTokenError } from 'jsonwebtoken';
const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

import { verifyToken } from '../auth/auth0Authorizer'
import { JwtPayload } from '../../auth/JwtPayload'
const docClient = new XAWS.DynamoDB.DocumentClient()
//const jwt = require('jsonwebtoken')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
//var idToken = "UNKNOWN"
 // var bearerToken = event.multiValueHeaders.Authorization[0].split(' ')
  console.log(JSON.stringify(event))

try{

  var AuthToken = event.multiValueHeaders.Authorization[0]
  let payload:JwtPayload = await verifyToken(AuthToken)


  var paylaodstring = payload as JwtPayload;
  const user_id = paylaodstring.sub;
  const todosTable = "todosTable"
  // const body = JSON.parse(event.body)
/*  await docClient.get({

    TableName:todosTable,
    Key:{
      "user_id":user_id 
    }
    
  }).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:"got them all."
    };
*/


var params = {
  TableName : todosTable,
  KeyConditionExpression: "#usr = :my_user_id",
  ExpressionAttributeNames:{
      "#usr": "user_id"
  },
  ExpressionAttributeValues: {
      ":my_user_id": user_id
  }
};

var Items = await docClient.query(params).promise();
/*
var Items = await docClient.query(params, function(err, data) {
  if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: "Error getting list." + JSON.stringify(err)
      };
  } else {
      console.log("Query succeeded."+JSON.stringify(data));
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
            body: Items
        };
      
  }
}).promise();*/

console.log(JSON.stringify(Items));
var retItems = {"items":Items.Items};
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body: JSON.stringify(retItems)
    };
  }catch (err){

    console.error(JSON.stringify(err));
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Error getting list." + JSON.stringify(err)
    };

  }
    
  //const jwtToken = await verifyToken(event.authorizationToken)
 


}
