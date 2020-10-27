import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Paper,
  Button,
  FormDialog,
  List,
} from '../../../components/Custom';
import {
  formatDate,
  getMembershipName,
} from '../../../utils/stringFormats';
import {
  FORM_DIALOG_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { Store } from '../../../Store';
import { Divider } from '@material-ui/core';

export default function Memberships() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const {
    state: { userInfo },
  } = useContext(Store);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    const members = await Promise.all(
      userInfo.persons.map(async p => {
        const { data } = await api(
          formatRoute('/api/entity/members', null, {
            id,
            personId: p.entity_id,
          }),
        );
        if (data.length) {
          const person = await api(
            formatRoute('/api/entity', null, {
              id: p.entity_id,
            }),
          );
          const items = await Promise.all(
            data.map(d => ({
              primary: getPrimary(d),
              secondary: getSecondary(d),
              status: d.status,
              type: GLOBAL_ENUM.MEMBERSHIP,
            })),
          );
          return {
            items,
            person: [
              {
                ...person.data,
                completeName: `${person.data?.name} ${person.data?.surname}`,
                type: GLOBAL_ENUM.PERSON,
              },
            ],
          };
        }
      }),
    );
    const res = members.filter(m => m);
    setMembers(res);
  };

  const getPrimary = member => {
    const name = t(getMembershipName(member.memberType));
    return name;
  };

  const getSecondary = member => {
    const expirationDate = formatDate(moment(member.expirationDate));
    return `${t('expire_on')} ${expirationDate}`;
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <Paper title={t('memberships')}>
      <Button
        size="small"
        variant="contained"
        style={{ margin: '8px' }}
        onClick={onOpen}
      >
        {t('become_member')}
      </Button>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
        items={{
          open,
          onClose,
          update: getMembers,
        }}
      />
      {members.map((m, index) => (
        <>
          <List items={m.person} />
          <List key={index} items={m.items} />
          <Divider />
        </>
      ))}
    </Paper>
  );
}
