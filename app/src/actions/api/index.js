import { API_BASE_URL } from '../../../../conf';

const api = async (route, { method, body } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    headers.Authorization = authToken;
  }

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

  if (method === 'DELETE') {
    const res = await fetch(`${API_BASE_URL}${route}`, {
      method: 'DELETE',
    });

    const status = res.status;

    return { status };
  }

  // Then, it is a get

  const res = await fetch(`${API_BASE_URL}${route}`, {
    headers: {
      Authorization: authToken,
    },
  }).then(res => res.json());
  return res;
};

export default api;

export const changeEntityName = async (
  id,
  { name, surname } = {},
) => {
  const bodyJSON = { id };

  if (name) {
    bodyJSON.name = name;
  }
  if (surname) {
    bodyJSON.surname = surname;
  }

  return api('/api/entity', {
    method: 'PUT',
    body: JSON.stringify(bodyJSON),
  });
};

export const deleteEntity = async id => {
  return api(formatRoute('/api/entity', null, { id }), {
    method: 'DELETE',
  });
};
