/**
 * The API using the AWS SDK for updating notes on the DynamoDB notes database.
 */

import uuid from 'uuid'

import buildResponse from './lib/responses'
import requestDynamoDB from './lib/dynamodb'

/**
 * Lambda function for updating notes on the DynamoDB database.
 * @method main
 * @param  {Object} event - All the information about the event that
 * triggered this Lambda function. The request to update a note.
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
   * The options used to update to the DynamoDB database, specifying table name,
   * what what item, the primary id, etc.
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
    },
    /**
     * The attributes/properties of the table items/notes to be updated.
     * @type {String}
     */
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    /**
     * The values of the attributes to be updated, received from request body.
     * @type {Object}
     */
    ExpressionAttributeValues: {
      /**
       * The new content to update the current note content with.
       * @type {Object}
       */
      ':content': data.content ? data.content : null,
      /**
       * The new attachment to update the current note attachment with.
       * @type {Object}
       */
      ':attachment': data.attachment ? data.attachment : null
    },
    ReturnValues: 'ALL_NEW'
  }

  // attempt to update a note
  try {
    // update the DynamoDB notes table with changes to a note
    requestDynamoDB('update', params)

    // handle successful update of a note on the table

    // send the HTTP request that AWS will respond to
    callback(null, buildResponse(200, { status: true }))
  } catch (error) {
    // handle failed table update
    console.log(error)

    // send the HTTP request that AWS will respond to
    callback(null, buildResponse(500, { status:false }))
  }
}
