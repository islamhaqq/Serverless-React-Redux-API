/**
 * The API using the AWS SDK for retrieving notes from the DynamoDB notes
 * database.
 */

import requestDynamoDB from './lib/dynamodb'
import buildResponse from './lib/responses'

/**
 * A lambda function that retrieves notes from the DynamoDB database when
 * a GET event is received.
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
     * Name of the table of the DynamoDB to update.
     * @type {String}
     */
    TableName: 'notes',
    /**
     * Defines the partition key and sort key of the note to be retrieved in
     * the table.
     * @type {Object}
     */
    Key: {
      /**
       * The unique identifier of the user that has the note.
       * @type {String}
       */
      userId: event.requestContext.identity.cognitoIdentityId,
      /**
       * The unique identifier for the note, provider by the parameter in the
       * path.
       * @type {String}
       */
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
