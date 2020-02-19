import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


const imagesBucketName = process.env.IMAGES_S3_BUCKET
//import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import Jimp from 'jimp/es'

import { verifyToken } from '../auth/auth0Authorizer'
import { JwtPayload } from '../../auth/JwtPayload'
//const AWSRay = AWSXRay.captureAWS(AWS)


const s3 = new AWS.S3({"signatureVersion":'v4'})
const signedUrlExpireSeconds = 120
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId

  var AuthToken = event.multiValueHeaders.Authorization[0]
  let payload:JwtPayload = await verifyToken(AuthToken)


  var paylaodstring = payload as JwtPayload;
  const userId = paylaodstring.sub;
  const todoId = event.pathParameters.todoId
  //, "ACL": "bucket-owner-full-control"
  console.log(JSON.stringify(event.multiValueHeaders))
//"ContentType":event.multiValueHeaders["content-type"][0]
  const params = {"Bucket": imagesBucketName, "Key": userId+"-"+todoId, "Expires": signedUrlExpireSeconds };
/*
  s3.getSignedUrl("putObject", params, function (err, url){
    if(err){
     console.log("Error getting presigned url from AWS S3");
     return { success : false, message : "Pre-Signed URL error", urls : url};
     }
     else{
     
     console.log("Presigned URL: ", url);
     //return { success : true, message : "AWS SDK S3 Pre-signed urls generated successfully.", urls : url};
     return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      uploadUrl:url
      }; 
    }
    });
*/
console.log(params)
const url = s3.getSignedUrl("putObject", params);
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body:JSON.stringify({uploadUrl:url})
  }; 
    /*  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:"Unknown error."
    };
*/
}
