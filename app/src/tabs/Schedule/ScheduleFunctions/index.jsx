import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import { SELECT_ENUM } from '../../../../../common/enums';
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';

const getPhases = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/phases', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.id,
    display: d.name,
  }));
  return [
    { value: SELECT_ENUM.NONE, displayKey: 'none_feminine' },
    ...res,
  ];
};

const getSlots = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/slots', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.date,
    display: formatDate(moment(d.date), 'ddd DD MMM h:mm'),
  }));
  return res;
};

const getTeams = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/teamsSchedule', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.name,
    display: d.name,
  }));
  return [
    { value: SELECT_ENUM.NONE, displayKey: 'none_feminine' },
    ...res,
  ];
};

const getFields = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/fields', null, { eventId }),
  );
  const res = data.map(d => ({
    value: d.field,
    display: d.field,
  }));
  return [{ value: SELECT_ENUM.NONE, displayKey: 'none' }, ...res];
};

export const getGameOptions = async eventId => {
  const res = await Promise.all([
    getSlots(eventId),
    getTeams(eventId),
    getPhases(eventId),
    getFields(eventId),
  ]);
  return {
    timeSlots: res[0],
    teams: res[1],
    phases: res[2],
    fields: res[3],
  };
};
