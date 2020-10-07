import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { AccordionDnD } from '../../components/Custom';

export default function EditRankings() {
  const { t } = useTranslation();
  const { id: eventId } = useParams();

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

  return (
    <div className={styles.div}>
      <AccordionDnD
        title={t('pre_ranking')}
        items={items}
        withIndex
      ></AccordionDnD>
    </div>
  );
}
