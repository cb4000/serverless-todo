import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


const imagesBucketName = process.env.IMAGES_S3_BUCKET
//import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import Jimp from 'jimp/es'

//const AWSRay = AWSXRay.captureAWS(AWS)


const s3 = new AWS.S3()
const signedUrlExpireSeconds = 120
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId

  const body = JSON.parse(event.body)

  const userId = body.idToken
  const todoId = event.pathParameters.todoID
  const params = {"Bucket": imagesBucketName, "Key": userId+"-"+todoId, "Expires": signedUrlExpireSeconds, "ACL": "bucket-owner-full-control", ContentType:"text/csv"};

  s3.getSignedUrl("putObject", params, function (err, url){
    if(err){
     console.log("Error getting presigned url from AWS S3");
     return { success : false, message : "Pre-Signed URL error", urls : url};
     }
     else{
     
     console.log("Presigned URL: ", url);
     return { success : true, message : "AWS SDK S3 Pre-signed urls generated successfully.", urls : url};
     }
    });
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
        body:"Unknown error."
    };

}
