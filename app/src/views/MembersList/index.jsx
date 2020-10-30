import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import {
  Paper,
  Button,
  IgContainer,
  FormDialog,
} from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import api from '../../actions/api';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import { List } from '../../components/Custom';
import {
  FORM_DIALOG_TYPE_ENUM,
  LIST_ITEM_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums';

export default function MembersList() {
  const { id } = useQuery();
  const { t } = useTranslation();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = formatPageTitle(
      t('members_list', { organization: organization?.name }),
    );
  }, [organization]);

  useEffect(() => {
    getEntity();
    getMembers();
  }, [id]);

  const getEntity = async () => {
    const { data } = await api(
      formatRoute('/api/entity', null, { id }),
    );
    setOrganization(data);
  };

  const getMembers = async () => {
    const { data, status } = await api(
      formatRoute('/api/entity/organizationMembers', null, { id }),
    );
    if (status === STATUS_ENUM.ERROR_STRING) {
      goTo(ROUTES.entityNotFound);
    } else {
      const res = data.map((d, index) => ({
        ...d,
        type: LIST_ITEM_ENUM.MEMBER,
        update: getMembers,
        key: index,
      }));
      setMembers(res);
    }
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <IgContainer>
      <Paper
        style={{ textAlign: 'center' }}
        title={t('members_list', {
          organization: organization?.name || '',
        })}
      >
        <Button
          size="small"
          variant="contained"
          endIcon="Add"
          style={{
            margin: '8px',
          }}
          onClick={onOpen}
        >
          {t('add_membership')}
        </Button>
        <List items={members} />
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.ADD_MEMBER}
          items={{
            open,
            onClose,
            update: getMembers,
          }}
        />
      </Paper>
    </IgContainer>
  );
}
