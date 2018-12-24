// @flow
import qs from 'querystring';
import extend from 'lodash/extend';
import Promise from 'bluebird';

export function getRequest({ ...rest }: any) {
  return request({ method: 'GET', ...rest });
}

export function postRequest({ ...rest }: any) {
  return request({ method: 'POST', ...rest });
}

export function putRequest({ ...rest }: any) {
  return request({ method: 'PUT', ...rest });
}

export function deleteRequest({ ...rest }: any) {
  return request({ method: 'DELETE', ...rest });
}

export function request({ url, method, body, query, headers = {} }: any) {
  const options = extend(
    {
      method: method,
      headers: headers,
    },
    body && {
      body: JSON.stringify(body),
    }
  );
  return Promise.resolve().then(() =>
    fetch(url + createQueryString(query), options)
  );
}

function createQueryString(query) {
  return query ? `?${qs.stringify(query)}` : '';
}
