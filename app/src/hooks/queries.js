import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../actions/api';

const paramsToObject = entries => {
  let result = {};
  for (let entry of entries) {
    // each 'entry' is a [key, value] tupple
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
};

export const useQuery = () => {
  const search = useLocation().search;
  const urlParams = new URLSearchParams(search);
  const entries = urlParams.entries();
  const params = paramsToObject(entries);

  return params;
};

export const useApiRoute = (route, options = {}) => {
  const { defaultValue } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState(defaultValue);

  const updateResponse = async () => {
    setIsLoading(true);
    try {
      const { data } = await api(route, options);

      setResponse(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (route) {
      updateResponse();
    } else {
      setResponse(defaultValue);
    }
  }, [route]);

  return { response, isLoading };
};
