import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Avatar, Button } from '../../../../components/Custom';
import { Card, Typography } from '../../../../components/MUI';
import api from '../../../../actions/api';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  const { userId } = props;
  const [completeName, setCompleteName] = useState('');
  const [initials, setInitials] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const follow = async () => {
    try {
      await api(`/api/followers/follow`, {
        method: 'POST',
        body: JSON.stringify({
          targetId: userId,
        }),
      });
      setIsFollowing(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const unfollow = async () => {
    try {
      await api(`/api/followers/unfollow`, {
        method: 'POST',
        body: JSON.stringify({
          targetId: userId,
        }),
      });
      setIsFollowing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    api(`/api/profile/userInfo/${userId}`).then(res => {
      const userInfo = res.data;
      console.log('userInfo', userInfo);

      const cName = `${userInfo.first_name} ${userInfo.last_name}`;
      const iTials = cName
        .split(/(?:-| )+/)
        .reduce(
          (prev, curr, index) =>
            index <= 2 ? `${prev}${curr[0]}` : prev,
          '',
        );

      setCompleteName(cName);
      setInitials(iTials);
      setBirthDate(userInfo.birth_date);
      setPhotoUrl(userInfo.photo_url);
      setIsFollowing(userInfo.isFollowing);
    });
  }, []);

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials={initials}
        photoUrl={photoUrl}
      ></Avatar>
      <br />
      <Typography variant="h3">{completeName}</Typography>
      {birthDate ? (
        <span>
          {t('birth_date_format', {
            age: moment().diff(moment(birthDate), 'years'),
            date: moment(birthDate),
          })}
        </span>
      ) : (
        <></>
      )}
      {isFollowing ? (
        <Button
          onClick={unfollow}
          variant="outlined"
          endIcon="Person"
        >
          {t('following')}
        </Button>
      ) : (
        <Button onClick={follow} endIcon="PersonAdd">
          {t('follow')}
        </Button>
      )}
    </Card>
  );
}
