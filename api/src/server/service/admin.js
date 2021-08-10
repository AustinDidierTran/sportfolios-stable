const {
  addEmailLandingPage: addEmailLandingPageHelper,
  createSport: createSportHelper,
  createTaxRate: createTaxRateHelper,
  getAllNewsLetterSubscriptions: getAllNewsLetterSubscriptionsHelper,
  getAllSports: getAllSportsHelper,
  getAllUsersAndSecond: getAllUsersAndSecondHelper,
  getAllTaxRates: getAllTaxRatesHelper,
  getEmailsLandingPage: getEmailsLandingPageHelper,
  updateActiveStatusTaxRate: updateActiveStatusTaxRateHelper,
  updateSport: updateSportHelper,
  deleteEmailLandingPage: deleteEmailLandingPageHelper,
  deleteTaxRate: deleteTaxRateHelper,
  deleteEntities: deleteEntitiesHelper,
  updateUserRole: updateUserRoleHelper,
} = require('../../db/queries/admin');

function createSport(sport) {
  return createSportHelper(sport);
}

function createTaxRate(body) {
  return createTaxRateHelper(body);
}
function addEmailLandingPage(body) {
  return addEmailLandingPageHelper(body);
}

function updateActiveStatusTaxRate(body) {
  return updateActiveStatusTaxRateHelper(body);
}

function getEmailsLandingPage() {
  return getEmailsLandingPageHelper();
}

function deleteTaxRate(body) {
  return deleteTaxRateHelper(body);
}

function deleteEntities(body) {
  return deleteEntitiesHelper(body);
}

function deleteEmailLandingPage(body) {
  return deleteEmailLandingPageHelper(body);
}

function getAllSports() {
  return getAllSportsHelper();
}

function getAllUsersAndSecond(limitNumber) {
  return getAllUsersAndSecondHelper(limitNumber);
}

function updateSport(id, sport) {
  return updateSportHelper(id, sport);
}

function getAllTaxRates() {
  return getAllTaxRatesHelper();
}

function getAllNewsLetterSubscriptions() {
  return getAllNewsLetterSubscriptionsHelper();
}

function updateUserRole(userId, role) {
  return updateUserRoleHelper(userId, role);
}

module.exports = {
  addEmailLandingPage,
  createSport,
  createTaxRate,
  getAllNewsLetterSubscriptions,
  getAllSports,
  getAllUsersAndSecond,
  getAllTaxRates,
  getEmailsLandingPage,
  updateActiveStatusTaxRate,
  updateSport,
  deleteEmailLandingPage,
  deleteTaxRate,
  deleteEntities,
  updateUserRole,
};
