/**
 * Helper functions to interface with DynamoDB and perform HTTP requests.
 * @type {String}
 */

import AWS from 'aws-sdk'

// set region to US East Ohio when connecting to DynamoDB
AWS.config.update({ region: 'us-east-2' })

/**
 * An object that interfaces with the DynamoDB service.
 * @type {AWS}
 */
const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * Make a HTTP request to DynamoDB to perform a task such as adding or deleting
 * data from the table.
 * @method requestDynamoDB
 * @param  {String} action - The HTTP request type (i.e. PUT, POST)
 * @param  {[type]} params - The options used to update to the DynamoDB
 * database, specifying table name, what what item, the primary id, etc.
 * @return {Promise} - A promise consisting the response.
 */
export default function requestDynamoDB(action, params) {
  return dynamoDB[action](params).promise()
}
