import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';

export default function Rankings() {
  const { id: eventId } = useParams();

  const [preRanking, setPreRanking] = useState([]);

  const getPreRanking = async () => {
    const { data } = await api(
      formatRoute('/api/entity/preRanking', null, {
        eventId,
      }),
    );
    setPreRanking(data);
  };

  useEffect(() => {
    getPreRanking();
  }, []);

  console.log({ preRanking });

  return <></>;
}
