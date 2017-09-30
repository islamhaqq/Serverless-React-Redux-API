/**
 * Helper function that creates a response object to be sent as part of a HTTP
 * request after which AWS will respond to and perform the requested actions,
 * if successful.
 * @method buildResponse
 * @param  {Number} statusCode - The standardized HTTP response status.
 * @param  {Object} body - The main data to be sent to AWS in the request.
 * @return {Object} The status code, body, and headers needed to make a HTTP
 * request.
 */
export default function buildResponse(statusCode, body) {
  /**
   * Response object in response to PUT request to update notes table.
   * @type {Object}
   */
  const response = {
    /**
     * The standardized HTTP status code indiciating success or error.
     * @type {Number}
     */
    statusCode: statusCode,
    /**
     * CORS access headers.
     * @type {Object}
     */
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    /**
     * Body of the response containing the created note.
     * @type {String}
     */
    body: JSON.stringify(body)
  }

  return response
}
