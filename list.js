/**
 * The API using the AWS SDK for retrieving a list of all notes of a user from
 * DynamoDB notes database.
 */

import requestDynamoDB from './lib/dynamodb'
import buildResponse from './lib/responses'

/**
 * A lambda function that retrieves a list of notes for a user from the
 * DynamoDB database when a QUERY event is received.
 * @method main
 * @param  {Object} event - All the information about the event that
 * triggered this Lambda function. The request to create a note.
 * @param  {Object} context - The runtime the Lambda function is executing in.
 * @param  {Function} callback - The function called after Lambda function is
 * executed with the results or errors. AWS will respond to the HTTP request
 * with it.
 * @return {void}
 */
export async function main(event, context, callback) {
  /**
   * The options used to retrieve notes from the DynamoDB database, specifying
   * table name, what item, the primary id, etc.
   * @type {Object}
   */
  const params = {
    /**
     * Name of the table of the DynamoDB to retrieve notes from.
     * @type {String}
     */
    TableName: 'notes',
    /**
     * The condition for the query: retrieve notes with matching userId.
     * @type {Object}
     */
    KeyConditionExpression: 'userId = :userId',
    /**
     * Define values used in the condition expression. Defines :userId to be
     * the Identity Pool identity id of the authenticated user.
     * @type {String}
     */
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId
    }
  }

  // attempt to retrieve the list of notes
  try {
    /**
     * The query response containing a list of notes of a user.
     * @type {Object}
     */
    const result = await requestDynamoDB('query', params)

    // send response indicating a successful request, with the array of notes.
    callback(null, buildResponse(200, result.Items))
  } catch (error) {
    // handle failed request to DynamoDB to retrieve a list of notes.
    console.log(error)
    callback(null, buildResponse(500, { status: false }))
  }
}
