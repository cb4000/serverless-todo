import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
//import AWS
const logger = createLogger('auth')
//const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET
//const secretsClient  = new AWS.SecretsManager()

//let cachedSecret: string 


//const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

export async function verifyToken(raw_token: string): Promise<JwtPayload> {
 let  token:string = getToken(raw_token)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt
  console.log('about to verify')
  return verify(token, secretField,{algorithms:['RS256']}) as JwtPayload
  // TODO: Implement token verification
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
console.log('got token: '+token)
  return token
}
 /*async function getSecret(){
   if (cachedSecret) return cachedSecret;
   const data = await secretsClient.getSecretValue({
     SecretId: secretId
   }).promise()
   cachedSecret = data.SecretString;
   return JSON.parse(cachedSecret);
 }*/