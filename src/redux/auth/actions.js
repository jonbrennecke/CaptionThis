// @flow
import * as Request from '../../utils/Request';
import { API_BASE_URL } from '../../constants';

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const res = await Request.postRequest({
    url: `${API_BASE_URL}/api/login`,
    body: { email, password },
  });
  const json = await res.json();
  return json.token;
};
