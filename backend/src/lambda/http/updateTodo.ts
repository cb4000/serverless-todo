import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

  import { verifyToken } from '../auth/auth0Authorizer'
  import { JwtPayload } from '../../auth/JwtPayload'
  const AWS = require('aws-sdk')
  const AWSXRay = require('aws-xray-sdk')
  const XAWS = AWSXRay.captureAWS(AWS)
   
const docClient = new XAWS.DynamoDB.DocumentClient()
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(JSON.stringify(event))

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  const todosTable = "todosTable"
  //const newTodo: UpdateTodoRequest = JSON.parse(event.body)

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
  // l
  var paylaodstring = payload as JwtPayload;
  const user_id = paylaodstring.sub;
  var newItem = {
    user_id:user_id,
    "todoId":todoId,
    ...updatedTodo
  };
  var retval = await docClient.put({
    TableName: todosTable,
    Key:{
      user_id: user_id,
      "todoId":todoId
    },
    Item: newItem
  }).promise()
  console.log(JSON.stringify(retval))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:JSON.stringify(newItem)
    };
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
