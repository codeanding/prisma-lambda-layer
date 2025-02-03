import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const DEFAULT_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Content-Type': 'application/json',
};

const buildHeaders = (event?: Partial<APIGatewayProxyEvent>): Record<string, string> => {
  return {
    ...DEFAULT_HEADERS,
    ...(event?.requestContext?.stage && { 'x-service-stage': event.requestContext.stage }),
    ...(event?.requestContext?.requestId && {
      'x-service-request-id': event.requestContext.requestId,
    }),
  };
};

export const formatHttpResponse = (
  statusCode: number,
  content: any,
  event?: Partial<APIGatewayProxyEvent>
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(content),
  headers: buildHeaders(event),
});

export const badRequest = (event?: APIGatewayProxyEvent, message = 'Invalid request') =>
  formatHttpResponse(400, { error: message }, event);

export const notFound = (event?: APIGatewayProxyEvent, message = 'Resource not found') =>
  formatHttpResponse(404, { error: message }, event);

export const internalServerError = (
  event?: APIGatewayProxyEvent,
  message = 'Internal Server Error'
) => formatHttpResponse(500, { error: message }, event);
