/**
 * The API using the AWS SDK for deleting notes on the DynamoDB notes database.
 */

import uuid from 'uuid'

import buildResponse from './lib/responses'
import requestDynamoDB from './lib/dynamodb'

/**
 * Lambda function for deleting notes on the DynamoDB database.
 * @method main
 * @param  {Object} event - All the information about the event that
 * triggered this Lambda function. The request to delete a note.
 * @param  {Object} context - The runtime the Lambda function is executing in.
 * @param  {Function} callback - The function called after Lambda function is
 * executed with the results or errors. AWS will respond to the HTTP request
 * with it.
 * @return {void}
 */
export async function main(event, context, callback) {
  /**
   * The parsed request body representing HTTP request parameters.
   * @type {Object}
   */
  const data = JSON.parse(event.body)

  /**
   * The options used to delete to the DynamoDB database, specifying table name,
   * what what item, the primary id, etc.
   * @type {Object}
   */
  const params = {
    /**
     * Name of the table of the DynamoDB to delete.
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

  // attempt to delete a note
  try {
    // delete a note in the DynamoDB notes table
    requestDynamoDB('delete', params)

    // handle successful delete of a note in the table

    // send the HTTP request that AWS will respond to
    callback(null, buildResponse(200, { status: true }))
  } catch (error) {
    // handle failed table delete
    console.log(error)

    // send the HTTP request that AWS will respond to
    callback(null, buildResponse(500, { status:false }))
  }
}
