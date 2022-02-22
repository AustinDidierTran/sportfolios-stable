import {
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import bcrypt from 'bcrypt';

import { insertAddress } from '../../db/queries/adresses';
import { insertPersonInfos } from '../../db/queries/personInfos';
import { insertEntity } from '../../db/queries/entity';
import { insertUserPrimaryPerson } from '../../db/queries/primaryPerson';
import { insertUserEntityRole } from '../../db/queries/userEntityRole';

import {
  generateHashedPassword,
  getBasicUserInfoFromId,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  getPrimaryPersonIdFromUserId,
  sendPersonTransferEmailAllIncluded,
  confirmEmail,
  updatePrimaryPerson as updatePrimaryPersonHelper,
  updateNewsLetterSubscription as updateNewsLetterSubscriptionHelper,
  useToken as useTokenHelper,
  getPeopleTransferedToUser as getPeopleTransferedToUserHelper,
  transferPerson as transferPersonHelper,
  getTokenPromoCode as getTokenPromoCodeHelper,
  cancelPersonTransfer as cancelPersonTransferHelper,
  declinePersonTransfer as declinePersonTransferHelper,
  getTransferInfosFromToken as getTransferInfosHelper,
  validateEmailIsConfirmed,
  isRegistered,
  createConfirmationEmailToken,
  createUserEmail,
  getEmailUser,
} from '../../db/queries/user.js';

import {
  getAllOwnedEntities,
  personIsAwaitingTransfer,
} from '../../db/queries/entity-deprecate.js';
import {
  generateAuthToken,
  generateToken,
  isAllowed,
} from '../../db/queries/utils.js';
import { validateEmailIsUnique } from '../../db/queries/auth.js';
import { insertEntitiesGeneralInfos } from '../../db/queries/entitiesGeneralInfos.js';
import { createCustomer, createPaymentMethod } from '../utils/stripe';
import Stripe from 'stripe';
import { insertCustomer } from '../../db/queries/stripe/customer.js';
import { UserInfo } from '../../typescript/user.js';

export const sendTransferPersonEmail = async (
  userId: string,
  { email, sendedPersonId }: { email: string; sendedPersonId: string },
): Promise<any> => {
  if ((await getEmailsFromUserId(userId)).find((e: any) => e.email == email)) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  return sendPersonTransferEmailAllIncluded({
    email,
    sendedPersonId,
    senderUserId: userId,
  });
};

export const cancelPersonTransfer = async (
  userId: string,
  personId: string,
): Promise<any> => {
  if (!(await isAllowed(personId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return cancelPersonTransferHelper(personId);
};

export const changePassword = async (
  userId: string,
  { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
): Promise<any> => {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const newHashedPassword = await generateHashedPassword(newPassword);

  const oldHashedPassword = await getHashedPasswordFromId(userId);

  if (!oldHashedPassword) {
    return STATUS_ENUM.ERROR;
  }

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  await updatePasswordFromUserId({
    id: userId,
    hashedPassword: newHashedPassword,
  });

  return STATUS_ENUM.SUCCESS;
};

export const changeUserInfo = async (
  userId: string,
  { language }: { language: string },
): Promise<any> => {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  await updateBasicUserInfoFromUserId({
    userId,
    language,
  });

  return STATUS_ENUM.SUCCESS;
};

export const addEmail = async (userId: string, email: string): Promise<any> => {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (!email) {
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
  }
  const isUnique = await validateEmailIsUnique(email);

  if (!isUnique) {
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
  }
  await createUserEmail({ userId, email });
  await confirmEmail({ email });

  return STATUS_ENUM.SUCCESS;
};

export const getEmails = async (userId: string): Promise<any> => {
  const emails = await getEmailsFromUserId(userId);

  if (!emails) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  return emails;
};

export const userInfo = async (id: string): Promise<any> => {
  const basicUserInfo = await getBasicUserInfoFromId(id);

  if (!basicUserInfo) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }
  // get basic user info
  return basicUserInfo;
};

export const getPeopleTransferedToUser = async (
  userId: string,
): Promise<any> => {
  return (await getPeopleTransferedToUserHelper(userId)).map((person: any) => {
    const { photo_url: photoUrl, ...otherProps } = person;
    return { photoUrl, isAwaitingApproval: true, ...otherProps };
  });
};

export const getOwnedPersons = async (userId: string): Promise<any> => {
  const persons = await getAllOwnedEntities(GLOBAL_ENUM.PERSON, userId);

  const primaryPersonId = await getPrimaryPersonIdFromUserId(userId);
  if (!persons || !primaryPersonId) {
    return;
  }
  const res = await Promise.all(
    persons.map(async (person: any) => {
      const isPrimaryPerson = person.id == primaryPersonId;
      const isToBeTransfered = await personIsAwaitingTransfer(person.id);
      const obj = { ...person, isPrimaryPerson, isToBeTransfered };
      return obj;
    }),
  );
  return res;
};

export const getOwnedAndTransferedPersons = async (
  userId: string,
): Promise<any> => {
  const [owned, transfered] = await Promise.all([
    (await getOwnedPersons(userId)).filter(
      (person: any) => person.role === ENTITIES_ROLE_ENUM.ADMIN,
    ),
    getPeopleTransferedToUser(userId),
  ]);
  const concat = owned.concat(transfered);

  //Permet de mettre la primary person comme 1er élément de la liste
  concat.sort((a: any, b: any) =>
    a.isPrimaryPerson ? -1 : b.isPrimaryPerson ? 1 : 0,
  );

  return concat;
};

export const getOwnedPersonsRegistration = async (
  eventId: string,
  userId: string,
): Promise<any> => {
  const [owned, transfered] = await Promise.all([
    (await getOwnedPersons(userId)).filter(
      (person: any) => person.role === ENTITIES_ROLE_ENUM.ADMIN,
    ),
    getPeopleTransferedToUser(userId),
  ]);
  const concat: any[] = owned.concat(transfered);
  //Permet de mettre la primary person comme 1er élément de la liste
  for (let i = 0; i < concat.length; i++) {
    if (concat[i].isPrimaryPerson) {
      concat.unshift(concat.splice(i, 1)[0]);
      break;
    }
  }

  const registered = await Promise.all(
    concat.map(async (c: any) => ({
      ...c,
      registered: await isRegistered(c.id, eventId),
    })),
  );
  return registered;
};

export const updatePrimaryPerson = async (
  body: any,
  userId: string,
): Promise<any> => {
  const { primaryPersonId } = body;
  if (!(await isAllowed(primaryPersonId, userId, ENTITIES_ROLE_ENUM.ADMIN))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updatePrimaryPersonHelper(userId, primaryPersonId);
};
export const useToken = async (body: any): Promise<any> => {
  const { tokenId } = body;
  return useTokenHelper(tokenId);
};

export const transferPerson = async (
  personId: string,
  userId: string,
): Promise<any> => {
  return transferPersonHelper(personId, userId);
};

export const getTokenPromoCode = async (body: any): Promise<any> => {
  const { token } = body;
  return getTokenPromoCodeHelper(token);
};

export const declinePersonTransfer = async (personId: string): Promise<any> => {
  return declinePersonTransferHelper(personId);
};

export const getTransferInfos = async (token: string): Promise<any> => {
  const infos = await getTransferInfosHelper(token);
  if (!infos) {
    //Token does not exists
    return;
  }
  const { email, person_id: personId, status, expires_at: espiresAt } = infos;
  const userId = await getUserIdFromEmail(email);
  let authToken, userInfo;
  if (userId) {
    //Login the user
    if (!(await validateEmailIsConfirmed(email))) {
      await createConfirmationEmailToken({
        email,
        token: await generateToken(),
      });
    }
    await confirmEmail({ email });
    authToken = await generateAuthToken(userId);
    userInfo = await getBasicUserInfoFromId(userId);
  }
  const isPending =
    status === PERSON_TRANSFER_STATUS_ENUM.PENDING && espiresAt > Date.now();
  return {
    email,
    personId: personId,
    isPending,
    userInfo,
    authToken,
  };
};

export const updateNewsLetterSubscription = async (
  userId: string,
  body: any,
): Promise<any> => {
  const subscription = await updateNewsLetterSubscriptionHelper(userId, body);
  return subscription;
};

interface Address {
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  id: string;
}

enum GENDER_ENUM {
  MALE = 'Male',
  FEMALE = 'Female',
  NOT_SPECIFIED = 'Other',
}

interface GoogleOutputAddress {
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const postInitialConfig = async (
  body: {
    primaryPerson: {
      image: string;
      photoUrl: string;
      name: string;
      surname: string;
      gender: GENDER_ENUM;
      birthDate: string;
      phoneNumber: string;
      formattedAddress: string;
      outputAddress: GoogleOutputAddress;
    };
    emergencyContact: {
      name: string;
      surname: string;
      phoneNumber: string;
      formmattedAddress: string;
      outputAddress: GoogleOutputAddress;
    };
    stripeToken: Stripe.Token;
  },
  userId: string,
): Promise<UserInfo> => {
  // Insert primary person

  // 1. Insert address
  const address = await insertAddress({
    // eslint-disable-next-line
    streetAddress: body.primaryPerson.outputAddress.street_address,
    city: body.primaryPerson.outputAddress.city,
    state: body.primaryPerson.outputAddress.state,
    zip: body.primaryPerson.outputAddress.zip,
    country: body.primaryPerson.outputAddress.country,
  });

  const addressId = address.id;

  // 2. Create person infos if emergency contact
  const personInfos = await insertPersonInfos({
    gender: body.primaryPerson.gender,
    emergencyName: body.emergencyContact?.name,
    emergencySurname: body.emergencyContact?.surname,
    emergencyPhoneNumber: body.primaryPerson.phoneNumber,
    medicalConditions: null,
    birthDate: body.primaryPerson.birthDate,
    phoneNumber: body.primaryPerson.phoneNumber,
    addressId,
  });

  // 3. Create the person
  const person = await insertEntity({
    type: GLOBAL_ENUM.PERSON,
  });

  await insertEntitiesGeneralInfos({
    entityId: person.id,
    description: null,
    quickDescription: null,
    name: body.primaryPerson.name,
    surname: body.primaryPerson.surname,
    photoUrl: body.primaryPerson.photoUrl,
    infosSuppId: personInfos.id,
  });

  // Insert inside the primary person table
  await insertUserPrimaryPerson({
    userId,
    primaryPerson: person.id,
  });

  await insertUserEntityRole({
    userId,
    entityId: person.id,
    role: ENTITIES_ROLE_ENUM.ADMIN,
  });

  // Add payment option

  if (body.stripeToken) {
    // 4. Create payment method

    const email = await getEmailUser(userId);

    const paymentMethod = await createPaymentMethod({
      stripeTokenId: body.stripeToken.id,
      city: body.stripeToken.card.address_city,
      country: body.stripeToken.card.country,
      line1: body.stripeToken.card.address_line1,
      line2: body.stripeToken.card.address_line2,
      postalCode: body.stripeToken.card.address_zip,
      state: body.stripeToken.card.address_state,
      email,
      name: body.stripeToken.card.name,
      phone: body.primaryPerson.phoneNumber,
    });

    // 5. Create customer
    const customer = await createCustomer({
      line1: body.stripeToken.card.address_line1,
      line2: body.stripeToken.card.address_line2,
      city: body.stripeToken.card.address_city,
      country: body.stripeToken.card.country,
      postalCode: body.stripeToken.card.address_zip,
      state: body.stripeToken.card.address_state,
      email,
      name: body.stripeToken.card.name,
      userId,
      paymentMethodId: paymentMethod.id,
      phoneNumber: body.primaryPerson.phoneNumber,
    });

    await insertCustomer({
      userId,
      customerId: customer.id,
      informations: customer,
      paymentMethodId: paymentMethod.id,
      last4: paymentMethod.card.last4,
      isDefault: true,
    });
  }

  // Fetch new user info

  const userInfo = await getBasicUserInfoFromId(userId);

  return userInfo;
};
