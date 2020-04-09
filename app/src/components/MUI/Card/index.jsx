import React from 'react';
import Card from '@material-ui/core/Card';

// See native documentation here: https://material-ui.com/components/cards/
import styles from './Card.module.css';

export default function CustomCard(props) {
  return <Card className={styles.card} {...props} />;
}
