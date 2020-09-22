const {
  getEventCategories: getEventsCategoriesHelper,
  getPageviewPathnames: getPageviewsPathnameHelper,
  getActiveEventCategories: getActiveEventsHelper,
  getActivePageviewsPathnames: getActivePageviewsHelper,
  updateEventCategoryToggle: updateEventHelper,
  updatePageviewsPathnameToggle: updatePageviewHelper,
} = require('../helpers/googleAnalytics');

async function getAllEvents() {
  return getEventsCategoriesHelper();
}

async function getAllPageviews() {
  return getPageviewsPathnameHelper();
}

async function getAllActiveEvents() {
  return getActiveEventsHelper();
}

async function getAllActivePageviews() {
  return getActivePageviewsHelper();
}

async function updateEvent(id, enabled) {
  return updateEventHelper(id, enabled);
}

async function updatePageview(id, enabled) {
  return updatePageviewHelper(id, enabled);
}

module.exports = {
  getAllEvents,
  getAllPageviews,
  getAllActiveEvents,
  getAllActivePageviews,
  updateEvent,
  updatePageview,
};
