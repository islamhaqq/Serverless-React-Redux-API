/**
 * The API using the AWS SDK for creating notes and adding them to the DynamoDB
 * notes database.
 */

import uuid from 'uuid'
import AWS from 'aws-sdk'

// set region to US East Ohio when connecting to DynamoDB
AWS.config.update({ region: 'us-east-2' })
/**
 * An object that interfaces with the DynamoDB service.
 * @type {AWS}
 */
const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * Lambda function for creating notes and adding them to the DynamoDB database.
 * @method main
 * @param  {Object} event - All the information about the event that
 * triggered this Lambda f unction. The request to create a note.
 * @param  {Object} context - The runtime the Lambda function is executing in.
 * @param  {Function} callback - The function called after Lambda function is
 * executed with the results or errors. AWS will respond to the HTTP request
 * with it.
 * @return {void}
 */
export function main(event, context, callback) {
  /**
   * The request body.
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
     * The note to add to the DynamoDB.
     * @type {Object}
     */
    Item: {
      /**
       * The user identity federated through the AWS Cognito service in its
       * Cognito Identity Pool. Use the identity id from the identity pool as
       * the user id of the authenticated user.
       * @type {[type]}
       */
      userId: event.requestContext.identity.cognitoIdentityId,
      /**
       * A unique id representing the note of a specific user.
       * @type {String}
       */
      noteId: uuid.v1(),
      /**
       * The main content of the note. Containing text and other info.
       * @type {Object}
       */
      content: data.content,
      /**
       * Any other dat attached to the note, such as files.
       * @type {Object}
       */
      attachment: data.attachment,
      /**
       * When the note was created.
       * @type {Date}
       */
      createdAt: new Date().getTime()
    }
  }

  // update the DynamoDB notes table with new note
  dynamoDB.put(params, (error, data) => {
    /**
     * Define headers that will allow CORS.
     * @type {Object}
     */
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    }

    // handle failed table update
    if (error) {
      const response = {
        /**
         * The standardized HTTP status code indiciating success or error.
         * @type {Number}
         */
        statusCode: 500,
        /**
         * CORS access headers.
         * @type {Object}
         */
        headers: headers,
        /**
         * Body of the response containing the created note.
         * @type {String}
         */
        body: JSON.stringify({ status: false })
      }

      // send the HTTP request that AWS will respond to
      callback(null, response)
      return
    }

    // handle successful update and addition of new note to table

    /**
     * Response object in response to PUT request to update notes table.
     * @type {Object}
     */
    const response = {
      /**
       * The standardized HTTP status code indiciating success or error.
       * @type {Number}
       */
      statusCode: 200,
      /**
       * CORS access headers.
       * @type {Object}
       */
      headers: headers,
      /**
       * Body of the response containing the created note.
       * @type {String}
       */
      body: JSON.stringify(params.Item)
    }

    // send the HTTP request that AWS will respond to
    callback(null, response)
  })
}
