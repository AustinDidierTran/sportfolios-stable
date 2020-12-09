import history from '../../stores/history';
import { getFormattedMailTo } from '../../utils/stringFormats';
import api from '../api';
import { ROUTES_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../../common/utils/stringFormat';
export { formatRoute } from '../../../../common/utils/stringFormat';
export const ROUTES = ROUTES_ENUM;

export const goTo = (route, params, queryParams) => {
  history.push(formatRoute(route, params, queryParams));
};

export const goToScrollTo = (
  route,
  params,
  queryParams,
  scrollTo,
) => {
  history.push(
    formatRoute(route, params, queryParams) + `#${scrollTo}`,
  );
};

export const goToLink = route => {
  history.push(route);
};

export const goToAlias = async (entityId, params, queryParams) => {
  const { data } = await api(
    formatRoute('/api/entity/alias', null, {
      entityId,
    }),
  );

  history.push(
    formatRoute(
      data ? data.alias || data.entityId : ROUTES.entityNotFound,
      params,
      queryParams,
    ),
  );
};

export const goToAndReplace = (route, params, queryParams) => {
  history.replace(formatRoute(route, params, queryParams));
};

export const goBack = () => {
  if (history.length) {
    history.goBack();
  } else {
    history.push(ROUTES.home);
  }
};

export const mailTo = (emailsFormatted, subject, message) => {
  document.location.href = getFormattedMailTo(
    emailsFormatted,
    subject,
    message,
  );
};
