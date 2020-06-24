import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { Paper, Table } from '../../../components/Custom';
import {
  getMembershipName,
  getMembershipType,
  getMembershipLength,
  getMembershipUnit,
} from '../../../utils/stringFormats';
import { MEMBERSHIP_TYPE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';

export default function AddMembership() {
  const { t } = useTranslation();

  const { id } = useParams();

  const [memberships, setMemberships] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getMemberships();
  }, [id]);

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);
    const data = [];
    res.data.map(
      (r, index) =>
        (data[index] = [
          t(getMembershipName(r.membership_type)),
          t(getMembershipType(r.length)),
          expirationDate(r.length, r.fixed_date),
          r.price,
        ]),
    );
    setMemberships(res.data);
    setData(data);
  };

  const expirationDate = (length, fixed_date) => {
    if (length !== -1) {
      return moment()
        .add(getMembershipLength(length), getMembershipUnit(length))
        .format('LL');
    } else {
      return moment(fixed_date).format('LL');
    }
  };

  const onDelete = async index => {
    await api(
      formatRoute('/api/entity/membership', null, {
        entity_id: memberships[index].entity_id,
        membership_type: memberships[index].membership_type,
        length: memberships[index].length,
        fixed_date: memberships[index].fixed_date,
      }),
      {
        method: 'DELETE',
      },
    );
    getMemberships();
  };

  const headers = [
    {
      display: t('membership'),
      value: 0,
      type: 'select',
      items: [
        {
          display: t('recreational_membership'),
          value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
        },
        {
          display: t('competitive_membership'),
          value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
        },
        {
          display: t('elite_membership'),
          value: MEMBERSHIP_TYPE_ENUM.ELITE,
        },
      ],
    },
    {
      display: t('Type'),
      value: 1,
      type: 'select',
      items: [
        { display: t('length'), value: 1 },
        { display: t('fixed_date'), value: 2 },
      ],
    },
    { display: t('expiration_date'), value: 2 },
    { display: t('price'), value: 3 },
  ];

  return (
    <Paper title={t('add_membership')}>
      <Table
        mode="edit"
        allowCreate={true}
        headers={headers}
        data={data}
        onDelete={onDelete}
      ></Table>
    </Paper>
  );
}
