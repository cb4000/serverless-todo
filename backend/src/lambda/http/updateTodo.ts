import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const AWS = require('aws-sdk')  
const docClient = new AWS.DynamoDB.DocumentClient()
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  const todosTable = "todosTable"
  const newTodo: UpdateTodoRequest = JSON.parse(event.body)


  await docClient.put({
    TableName: todosTable,
    Key:{
      "idToken":todoId
    },
    Item: updatedTodo
  }).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:JSON.stringify(newTodo)
    };
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
