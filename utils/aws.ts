import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import {
	S3Client,
	AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'

// Set the AWS Region
const REGION = 'eu-west-2' //REGION
// a client can be shared by different commands.
const s3 = new S3Client({
	region: REGION,
	credentials: fromCognitoIdentityPool({
		client: new CognitoIdentityClient({
			region: REGION,
		}),
		identityPoolId:
			'7fcdb274-15c9-4d52-b43c-29ba9caf47df', // IDENTITY_POOL_ID
	}),
})

const albumBucketName = 'galionix-bucket' //BUCKET_NAME

// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'eu-west-2' // Region
// AWS.config.credentials =
// 	new AWS.CognitoIdentityCredentials({
// 		IdentityPoolId:
// 			'eu-west-2:7fcdb274-15c9-4d52-b43c-29ba9caf47df',
// 	})
// const command = new AbortMultipartUploadCommand(
// 	params
// )
