import React, { useState, useEffect } from 'react';
import styles from './Ranking.module.css';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { Accordion } from '../../../components/Custom';
import { List } from '../../../components/Custom';

export default function Ranking(props) {
  const { ranking, title, withStats } = props;

  const [items, setItems] = useState([]);

  const getItems = () => {
    if (withStats) {
      const items = ranking.map((r, index) => ({
        ...r,
        type: GLOBAL_ENUM.RANKING_WITH_STATS,
        index: index + 1,
      }));
      setItems(items);
    } else {
      const items = ranking.map((r, index) => ({
        ...r,
        type: GLOBAL_ENUM.RANKING,
        index: index + 1,
      }));
      setItems(items);
    }
  };
  useEffect(() => {
    getItems();
  }, [ranking]);

  if (!ranking.length) {
    return <></>;
  }

  return (
    <div className={styles.div}>
      <Accordion title={title} content={<List items={items} />} />
    </div>
  );
}
