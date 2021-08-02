const {
  getEventCategories: getEventsCategoriesHelper,
  getPageviewPathnames: getPageviewsPathnameHelper,
  getActiveEventCategories: getActiveEventsHelper,
  getActivePageviewsPathnames: getActivePageviewsHelper,
  updateEventCategoryToggle: updateEventHelper,
  updatePageviewsPathnameToggle: updatePageviewHelper,
  addPageviewsPathname: addPageviewHelper,
} = require('../../db/queries/googleAnalytics');

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

module.exports = {
  getAllEvents,
  getAllPageviews,
  getAllActiveEvents,
  getAllActivePageviews,
  updateEvent,
  updatePageview,
  addPageview,
};
