import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { JsonWebTokenError } from 'jsonwebtoken';

const AWS = require('aws-sdk')  
const docClient = new AWS.DynamoDB.DocumentClient()
//const jwt = require('jsonwebtoken')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
var idToken = "UNKNOWN"
  var bearerToken = event.multiValueHeaders.Authorization[0].split(' ')
  console.log(JSON.stringify(event))
  if(bearerToken[0] == "Bearer"){
    idToken = bearerToken[1];
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
          body:"yay,  Bearer Token."
      };
  }else{
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
          body:"No Bearer Token."
      };
  }
  //const jwtToken = await verifyToken(event.authorizationToken)
  const todosTable = "todosTable"
  // const body = JSON.parse(event.body)
  await docClient.get({

    TableName:todosTable,
    Key:{
      "idToken":idToken
    }
    
  }).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:"got them all."
    };


}
