import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import {
  Paper,
  Button,
  IgContainer,
  FormDialog,
  IconButton,
} from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import api from '../../actions/api';
import {
  formatRoute,
  goToAndReplace,
  ROUTES,
} from '../../actions/goTo';
import { List } from '../../components/Custom';
import {
  FORM_DIALOG_TYPE_ENUM,
  LIST_ITEM_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums';
import styles from './MembersList.module.css';

export default function MembersList() {
  const { id } = useQuery();
  const { t } = useTranslation();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    organization
      ? (document.title = formatPageTitle(
          t('members_list', { organization: organization?.name }),
        ))
      : '';
  }, [organization]);

  useEffect(() => {
    getEntity();
    getMembers();
  }, [id]);

  const getEntity = async () => {
    const {
      data: { basicInfos: data },
    } = await api(formatRoute('/api/entity', null, { id }));
    setOrganization(data);
  };

  const getMembers = async () => {
    const { data, status } = await api(
      formatRoute('/api/entity/organizationMembers', null, { id }),
    );
    if (status === STATUS_ENUM.ERROR_STRING) {
      goToAndReplace(ROUTES.entityNotFound);
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
        <div className={styles.button}>
          <IconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            style={{ color: 'primary', margin: '8px' }}
          />
          <Button
            size="small"
            variant="contained"
            style={{
              margin: '8px',
              width: 'fit-content',
            }}
            onClick={onOpen}
          >
            {t('add_membership')}
          </Button>
        </div>
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
