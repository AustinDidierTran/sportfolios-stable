import { useLocation } from 'react-router-dom';

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
