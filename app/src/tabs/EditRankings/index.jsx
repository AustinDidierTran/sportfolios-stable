import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { AccordionDnD } from '../../components/Custom';
import { ACTION_ENUM, Store } from '../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';

export default function EditRankings() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const { dispatch } = useContext(Store);

  const [items, setItems] = useState([]);

  useEffect(() => {
    getRankings();
  }, []);

  const getRankings = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rankings', null, {
        eventId,
      }),
    );
    const ranking = data
      .map(d => ({
        position: d.initial_position,
        content: d.name,
        id: d.team_id,
      }))
      .sort((a, b) => a.position - b.position)
      .map((m, index) => {
        if (!m.position) {
          m.position = index + 1;
        }
        return m;
      });
    setItems(ranking);
  };

  const onSave = async items => {
    const res = await api(`/api/entity/updatePreRanking`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        ranking: items,
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('preranking_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const buttons = [
    {
      onClick: onSave,
      name: t('save'),
      color: 'primary',
    },
  ];

  return (
    <div className={styles.div}>
      <AccordionDnD
        title={t('preranking')}
        items={items}
        withIndex
        buttons={buttons}
      ></AccordionDnD>
    </div>
  );
}
