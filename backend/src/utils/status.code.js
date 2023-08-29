export const STATUS_CODE = {
  request_success: 200, // GET, DELETE, PATCH
  created_success: 201, // MOSTLY POST -> Creation request
  requested_success: 202, // Created request but pending for approval like rider registeration
  bad_request: 400, //server will not process the request due to something that is perceived to be a client error
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  not_acceptable: 406, //response is sent when web server doesn't find any content that conforms to the criteria given.
  conflict: 409,
  internal_server_error: 500,
  bad_gateway: 502,
  service_unavailable: 503,
};
