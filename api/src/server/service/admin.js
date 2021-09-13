import {
  addEmailLandingPage as addEmailLandingPageHelper,
  createSport as createSportHelper,
  createTaxRate as createTaxRateHelper,
  getAllNewsLetterSubscriptions as getAllNewsLetterSubscriptionsHelper,
  getAllSports as getAllSportsHelper,
  getAllTaxRates as getAllTaxRatesHelper,
  getEmailsLandingPage as getEmailsLandingPageHelper,
  updateActiveStatusTaxRate as updateActiveStatusTaxRateHelper,
  updateSport as updateSportHelper,
  deleteEmailLandingPage as deleteEmailLandingPageHelper,
  deleteTaxRate as deleteTaxRateHelper,
  deleteEntities as deleteEntitiesHelper,
  updateUserRole as updateUserRoleHelper,
  getUsersByFilter,
  getSecondAccount
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

async function getUsersAndSecond(offset, filter) {
  const primaryUser = await getUsersByFilter(offset, filter);
  return Promise.all(
    primaryUser.map(async user => {
      const secondAccount = await getSecondAccount(user.user_id);
      return {
        id: user.user_id,
        entityId: user.primary_person,
        emails: user.emails,
        name: user.name,
        surname: user.surname,
        role: user.app_role,
        photoUrl: user.photo_url,
        secondAccount: secondAccount,
      };
    }),
  );
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
  getAllTaxRates,
  getEmailsLandingPage,
  updateActiveStatusTaxRate,
  updateSport,
  deleteEmailLandingPage,
  deleteTaxRate,
  deleteEntities,
  updateUserRole,
  getUsersAndSecond
};
