import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

const imagesBucketName = process.env.IMAGES_S3_BUCKET
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { verifyToken } from '../auth/auth0Authorizer'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = "todosTable"

//import { verify } from 'jsonwebtoken'
const uuid = require('uuid')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log(event)
  // TODO: Implement creating a new TODO item


  var payload: JwtPayload;
  //var idToken = "UNKNOWN"
  var AuthToken = event.multiValueHeaders.Authorization[0]
  // const jwtToken = await verifyToken(idToken)
  try {

  payload = await verifyToken(AuthToken)
    
  } catch (err) {

      console.log(JSON.stringify(err));
      console.error(err.stack||err)
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "BAD Bearer Token." + JSON.stringify(err)
    };
  }
  // logger.info('User was authorized', jwtToken)
  var paylaodstring = payload as JwtPayload;
  try {
    console.log("paylaodstring: " + JSON.stringify(paylaodstring));
    const user_id = paylaodstring.sub;
    const itemId = uuid.v4()

    const key = user_id+"-"+itemId;
    const newItem = {

      user_id: user_id,
      todoId: itemId,
      attachmentUrl: 'https://'+encodeURIComponent(imagesBucketName)+'.s3.amazonaws.com/'+encodeURIComponent(key),
      ...newTodo
    }
    console.log("About to write: " + JSON.stringify(newItem));
    await docClient.put({
      TableName: todosTable,
      Item: newItem
    }).promise()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({"item":newItem})
    };

  } catch (err) {
    console.log(JSON.stringify(err));

  }

}
