import React, { useState, useEffect } from 'react';
import styles from './Ranking.module.css';
import { LIST_ITEM_ENUM } from '../../../../../common/enums';
import { Accordion, List } from '../../../components/Custom';

export default function Ranking(props) {
  const { ranking, title, withStats, withoutPosition } = props;

  const [items, setItems] = useState([]);

  const getItems = () => {
    if (withStats) {
      const items = ranking.map((r, index) => ({
        ...r,
        type: LIST_ITEM_ENUM.RANKING_WITH_STATS,
        index: index + 1,
        key: index,
        withoutPosition,
      }));
      setItems(items);
    } else {
      const items = ranking.map((r, index) => ({
        ...r,
        type: LIST_ITEM_ENUM.RANKING,
        index: index + 1,
        key: index,
        withoutPosition,
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
