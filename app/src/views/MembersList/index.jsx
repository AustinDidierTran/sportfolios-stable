import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import { Paper, Button, IgContainer } from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { List } from '../../components/Custom';
import { LIST_ITEM_ENUM } from '../../../../common/enums';

export default function MembersList() {
  const { id } = useQuery();
  const { t } = useTranslation();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);

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
    const { data } = await api(
      formatRoute('/api/entity/organizationMembers', null, { id }),
    );
    const res = data.map((d, index) => ({
      ...d,
      type: LIST_ITEM_ENUM.MEMBER,
      key: index,
    }));
    setMembers(res);
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
          onClick={() => {}}
        >
          {t('add_member')}
        </Button>
        <List items={members} />
      </Paper>
    </IgContainer>
  );
}
