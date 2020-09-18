import ReactGa from 'react-ga';
import api from '../../../actions/api';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../../../../../conf';

const TRACKING_ID = GOOGLE_ANALYTICS_TRACKING_ID;

export const InitGa = () => {
  ReactGa.initialize(TRACKING_ID);
};

export const AddGaPageView = async () => {
  const activePageviews = await api('/api/ga/activePageviews');
  if (
    activePageviews.data.some(
      pv => pv.pathname === window.location.pathname,
    )
  ) {
    ReactGa.pageview(window.location.pathname);
  }
};

/**
 * Event - Add custom tracking event.
 * @param {string} args
 * category and action are required,
 */
export const AddGaEvent = async ({ category, action, label }) => {
  if (category === undefined || action === undefined) {
    throw new Error('category and action are required');
  }

  const activeEvents = await api('/api/ga/activeEvents');
  if (activeEvents.data.some(e => e.category === category)) {
    ReactGa.event({ category, action, label });
  }
};
