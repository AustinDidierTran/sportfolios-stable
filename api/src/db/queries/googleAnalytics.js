const knex = require('../connection');

async function getEventCategories() {
  return knex('ga_toggles_events')
    .select('*')
    .orderBy('category');
}

async function getPageviewPathnames() {
  return knex('ga_toggles_pageviews')
    .select('*')
    .orderBy('pathname');
}

async function getActiveEventCategories() {
  return knex('ga_toggles_events')
    .select('category')
    .where({ enabled: true });
}

async function getActivePageviewsPathnames() {
  return knex('ga_toggles_pageviews')
    .select('pathname')
    .where({ enabled: true });
}

async function updateEventCategoryToggle(categoryId, enabled) {
  return knex('ga_toggles_events')
    .update({ enabled })
    .where({ id: categoryId })
    .returning('*');
}

async function updatePageviewsPathnameToggle(pathnameId, enabled) {
  return knex('ga_toggles_pageviews')
    .update({ enabled })
    .where({ id: pathnameId })
    .returning('*');
}

async function addPageviewsPathname(pathname, enabled) {
  return knex('ga_toggles_pageviews')
    .insert({
      pathname,
      enabled,
    })
    .returning('*');
}

module.exports = {
  getEventCategories,
  getPageviewPathnames,
  getActiveEventCategories,
  getActivePageviewsPathnames,
  updateEventCategoryToggle,
  updatePageviewsPathnameToggle,
  addPageviewsPathname,
};
