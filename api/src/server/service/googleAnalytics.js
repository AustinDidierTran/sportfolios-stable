import {
  getEventCategories as getEventsCategoriesHelper,
  getPageviewPathnames as getPageviewsPathnameHelper,
  getActiveEventCategories as getActiveEventsHelper,
  getActivePageviewsPathnames as getActivePageviewsHelper,
  updateEventCategoryToggle as updateEventHelper,
  updatePageviewsPathnameToggle as updatePageviewHelper,
  addPageviewsPathname as addPageviewHelper,
} from '../../db/queries/googleAnalytics.js';

function getAllEvents() {
  return getEventsCategoriesHelper();
}

function getAllPageviews() {
  return getPageviewsPathnameHelper();
}

function getAllActiveEvents() {
  return getActiveEventsHelper();
}

function getAllActivePageviews() {
  return getActivePageviewsHelper();
}

function updateEvent(id, enabled) {
  return updateEventHelper(id, enabled);
}

function updatePageview(id, enabled) {
  return updatePageviewHelper(id, enabled);
}

function addPageview(pathname, enabled) {
  return addPageviewHelper(pathname, enabled);
}

export {
  getAllEvents,
  getAllPageviews,
  getAllActiveEvents,
  getAllActivePageviews,
  updateEvent,
  updatePageview,
  addPageview,
};
