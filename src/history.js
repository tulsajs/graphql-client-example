import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

export const history = createHistory();
export const skipParam = () => {
  return queryString.parse(createHistory().location.search).skip;
};
