import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import { SELECT_ENUM } from '../../../../../common/enums';
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';

export const getPhases = async (eventId, withoutAll) => {
  const { data } = await api(
    formatRoute('/api/entity/phases', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.id,
    display: d.name,
  }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getSlots = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/slots', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.id,
    display: formatDate(moment(d.date), 'ddd DD MMM HH:mm'),
  }));
  return res;
};

export const getFutureSlots = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/slots', null, { eventId }),
  );
  const res = data
    .filter(d => moment(d.date) >= moment())
    .map(d => ({
      value: d.id,
      display: formatDate(moment(d.date), 'ddd DD MMM HH:mm'),
    }));
  return res;
};

export const getTeams = async (eventId, withoutAll) => {
  const { data } = await api(
    formatRoute('/api/entity/teamsSchedule', null, { eventId }),
  );
  const res = data.map(d => {
    return {
      value: d.roster_id,
      display: d.name,
    };
  });
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getFields = async (eventId, withoutAll) => {
  const { data } = await api(
    formatRoute('/api/entity/fields', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.id,
    display: d.field,
  }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getFutureGameOptions = async (eventId, withoutAll) => {
  const res = await Promise.all([
    getFutureSlots(eventId),
    getTeams(eventId, withoutAll),
    getPhases(eventId, withoutAll),
    getFields(eventId, withoutAll),
  ]);
  return {
    timeSlots: res[0],
    teams: res[1],
    phases: res[2],
    fields: res[3],
  };
};

export const getGameOptions = async (eventId, withoutAll) => {
  const res = await Promise.all([
    getSlots(eventId),
    getTeams(eventId, withoutAll),
    getPhases(eventId, withoutAll),
    getFields(eventId, withoutAll),
  ]);
  return {
    timeSlots: res[0],
    teams: res[1],
    phases: res[2],
    fields: res[3],
  };
};
