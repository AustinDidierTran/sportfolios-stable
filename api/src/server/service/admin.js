import {
  addEmailLandingPage as addEmailLandingPageHelper,
  createSport as createSportHelper,
  createTaxRate as createTaxRateHelper,
  getAllNewsLetterSubscriptions as getAllNewsLetterSubscriptionsHelper,
  getAllSports as getAllSportsHelper,
  getAllUsersAndSecond as getAllUsersAndSecondHelper,
  getAllTaxRates as getAllTaxRatesHelper,
  getEmailsLandingPage as getEmailsLandingPageHelper,
  updateActiveStatusTaxRate as updateActiveStatusTaxRateHelper,
  updateSport as updateSportHelper,
  deleteEmailLandingPage as deleteEmailLandingPageHelper,
  deleteTaxRate as deleteTaxRateHelper,
  deleteEntities as deleteEntitiesHelper,
  updateUserRole as updateUserRoleHelper,
} from '../../db/queries/admin.js';

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

export {
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
