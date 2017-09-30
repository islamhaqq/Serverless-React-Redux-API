/**
 * The API using the AWS SDK for retrieving notes from the DynamoDB notes
 * database.
 */

import requestDynamoDB from './lib/dynamodb'
import buildResponse from './lib/responses'

export async function main(event, context, callback) {
  const params = {
    TableName: 'notes',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  }

  try {
    // retrieve a note from the notes table in DynamoDB
    const result = await requestDynamoDB('get', params)

    if (result.Item) {
      callback(null, buildResponse(200, result.Item))
    } else {
      callback(null, buildResponse(500, { status: false, error: "note not found!" }))
    }
  } catch (error) {
    console.log(error)

    callback(null, buildResponse(500, { status: false }))
  }
}
