import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { verifyToken } from '../auth/auth0Authorizer'
import { JwtPayload } from '../../auth/JwtPayload'
const AWS = require('aws-sdk')  
const docClient = new AWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const todosTable = "todosTable"
  
    var AuthToken = event.multiValueHeaders.Authorization[0]
    let payload:JwtPayload = await verifyToken(AuthToken)
  
  
    var paylaodstring = payload as JwtPayload;
    const user_id = paylaodstring.sub;
    await docClient.delete({
      TableName:todosTable,
      Key:{
        user_id: user_id,
        todoId:todoId
      }
    }).promise()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
          body:"Deleted."
      };

  
}
