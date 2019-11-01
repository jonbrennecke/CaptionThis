// @flow
import qs from 'querystring';
import extend from 'lodash/extend';
import Promise from 'bluebird';

export type RequestArgs = {
  url: string,
  method: string,
  body: any,
  query: { [key: string]: string },
  headers: { [key: string]: string },
};

export function getRequest({
  ...rest
}: $Rest<RequestArgs, { method: string }>) {
  return request({ method: 'GET', ...rest });
}

export function postRequest({
  ...rest
}: $Rest<RequestArgs, { method: string }>) {
  return request({ method: 'POST', ...rest });
}

export function putRequest({
  ...rest
}: $Rest<RequestArgs, { method: string }>) {
  return request({ method: 'PUT', ...rest });
}

export function deleteRequest({
  ...rest
}: $Rest<RequestArgs, { method: string }>) {
  return request({ method: 'DELETE', ...rest });
}

export async function request({
  url,
  method,
  body,
  query,
  headers = {},
}: RequestArgs): Promise<any> {
  const extendedHeaders = body
    ? { ...headers, 'Content-Type': 'application/json' }
    : headers;
  const options = extend({
    method: method,
    headers: extendedHeaders,
    body: body ? JSON.stringify(body) : null,
  });
  return await fetch(url + createQueryString(query), options);
}

function createQueryString(query) {
  return query ? `?${qs.stringify(query)}` : '';
}
