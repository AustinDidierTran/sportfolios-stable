import React, { useEffect, useState, useContext } from 'react';

import { Paper } from '../../../components/Custom';
import MembershipTable from './MembershipTable';

import {
  getMembershipName,
  getMembershipType,
  getExpirationDate,
} from '../../../utils/stringFormats';
import {
  MEMBERSHIP_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
} from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Store, ACTION_ENUM } from '../../../Store';

export default function AddMembership() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

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
          getExpirationDate(r.length, r.fixed_date),
          r.price,
        ]),
    );
    setMemberships(res.data);
    setData(data);
  };

  const onAdd = async values => {
    const membership_type = values[0].value;
    let length;
    let fixed_date;
    if (values[1].value === 2) {
      length = -1;
      fixed_date = values[2].value;
    } else {
      length = values[2].value;
      fixed_date = '01/01';
    }
    const price = values[3].value * 100;
    const res = await api(`/api/entity/membership`, {
      method: 'POST',
      body: JSON.stringify({
        entity_id: id,
        membership_type,
        length,
        fixed_date,
        price,
      }),
    });
    if (res.status === 400) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('membership_exist'),
        severity: 'error',
      });
      return;
    } else {
      getMemberships();
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

  const [disabled, setDisabled] = useState(true);
  const [fixedDate, setFixedDate] = useState(true);

  const onChangeType = event => {
    if (event.target.value === 1) {
      setFixedDate(false);
      setDisabled(false);
    } else {
      setFixedDate(true);
      setDisabled(false);
    }
  };

  const headers = [
    {
      display: t('membership'),
      value: 0,
      type: 'select',
      onChange: () => {},
      items: [
        {
          display: t('recreational'),
          value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
        },
        {
          display: t('competitive'),
          value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
        },
        {
          display: t('elite'),
          value: MEMBERSHIP_TYPE_ENUM.ELITE,
        },
      ],
    },
    {
      display: t('Type'),
      value: 1,
      type: 'select',
      onChange: onChangeType,
      items: [
        { display: t('length'), value: 1 },
        { display: t('fixed_date'), value: 2 },
      ],
    },
    fixedDate
      ? {
          display: 'MM/DD',
          type: 'moment',
          disabled,
          value: 2,
        }
      : {
          display: t('length'),
          type: 'select',
          onChange: () => {},
          disabled,
          value: 2,
          items: [
            {
              display: t('one_month'),
              value: MEMBERSHIP_LENGTH_ENUM.ONE_MONTH,
            },
            {
              display: t('six_month'),
              value: MEMBERSHIP_LENGTH_ENUM.SIX_MONTH,
            },
            {
              display: t('one_year'),
              value: MEMBERSHIP_LENGTH_ENUM.ONE_YEAR,
            },
          ],
        },

    { display: t('price'), type: 'number', value: 3 },
  ];

  return (
    <Paper title={t('add_membership')}>
      {window.innerWidth < 600 ? (
        <Typography>{t('only_available_on_desktop')}</Typography>
      ) : (
        <>
          <MembershipTable
            mode="edit"
            headers={headers}
            data={data}
            onDelete={onDelete}
            onAdd={onAdd}
          ></MembershipTable>
        </>
      )}
    </Paper>
  );
}
