import React, { useEffect, useState } from 'react';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import styles from './TeamRankingCard.module.css';
import { Typography } from '../../../../components/MUI';

export default function TeamRankingCard(props) {
  const { position, teamId } = props;
  const [team, setTeam] = useState({});

  const getTeam = async () => {
    const {
      data: { basicInfos: data },
    } = await api(
      formatRoute('/api/entity', null, {
        id: teamId,
      }),
    );
    setTeam(data);
  };

  useEffect(() => {
    getTeam();
  }, [teamId]);

  return (
    <div className={styles.div}>
      <Typography>{position}</Typography>
      <Typography>{team.name}</Typography>
    </div>
  );
}
