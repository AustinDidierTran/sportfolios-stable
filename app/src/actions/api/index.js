import { API_BASE_URL } from '../../../../conf';

export default async (route, { method, body } = {}) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken
    ? {
        'Content-Type': 'application/json',
        Authorization: authToken,
      }
    : {
        'Content-Type': 'application/json',
      };
  if (method === 'POST') {
    const res = await fetch(`${API_BASE_URL}${route}`, {
      method: 'POST',
      headers,
      body,
    });
    const status = res.status;
    const { data } = await res.json();

    return { data, status };
  }

  if (method === 'PUT') {
    const res = await fetch(`${API_BASE_URL}${route}`, {
      method: 'PUT',
      headers,
      body,
    });

    const status = res.status;

    const data = await res.json();

    return { data, status };
  }

  // Then, it is a get

  const res = await fetch(`${API_BASE_URL}${route}`, {
    headers: {
      Authorization: authToken,
    },
  }).then(res => res.json());
  return res;
};
