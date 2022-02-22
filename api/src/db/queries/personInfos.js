import { personInfos as personInfosModel } from '../models/personInfos';

export const insertPersonInfos = async body => {
  const {
    gender,
    emergencyName,
    emergencySurname,
    emergencyPhoneNumber,
    medicalConditions,
    birthDate,
    phoneNumber,
    addressId,
  } = body;

  const personInfos = await personInfosModel
    .query()
    .insertGraph({
      gender,
      emergency_name: emergencyName,
      emergency_surname: emergencySurname,
      emergency_phone_number: emergencyPhoneNumber,
      medical_conditions: medicalConditions,
      birth_date: birthDate,
      phone_number: phoneNumber,
      address_id: addressId,
    })
    .returning('*');

  return {
    id: personInfos.id,
    gender,
    emergencyName: personInfos.emergency_name,
    emergencySurname: personInfos.emergency_surname,
    emergencyPhoneNumber: personInfos.emergency_phone_number,
    medicalConditions: personInfos.medical_conditions,
    birthDate: personInfos.birth_date,
    phoneNumber: personInfos.phone_number,
    addressId: personInfos.address_id,
  };
};
