export const getRequestArguments = (requestBody: any, requestQuery: any): string => {
  const message = `Body: ${JSON.stringify(requestBody)} | Query: ${JSON.stringify(requestQuery)}`;
  return message;
}
