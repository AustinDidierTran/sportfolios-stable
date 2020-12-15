import React, { useEffect, useState } from 'react';
import { CLIENT_BASE_URL } from '../../../../../../conf';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import {
  STATUS_ENUM,
  ROUTES_ENUM,
} from '../../../../../../common/enums';
import { IconButton } from '../../../../components/Custom';
import { Typography } from '@material-ui/core';
import styles from './RosterInviteLink.module.css';
import CopyToClipBoard from '../../../../components/Custom/IconButton/CopyToClipboard';

export default function RosterInviteLink(props) {
  const [link, setLink] = useState();
  const { rosterId } = props;

  async function fetchLink() {
    const res = await api(
      formatRoute('/api/entity/rosterInviteToken', null, {
        rosterId,
      }),
    );
    console.log({ res });
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      setLink(
        CLIENT_BASE_URL +
          formatRoute(ROUTES_ENUM.rosterInviteLink, {
            token: res.data,
          }),
      );
    }
  }
  useEffect(() => {
    fetchLink();
  }, [rosterId]);

  return (
    <div>
      <Typography variant="body1">
        Laisse tes amis s'ajouter eux mêmes à ton alignement en leur
        partageant ce lien.
      </Typography>
      <div className={styles.linkDiv}>
        <Typography variant="body2">{link}</Typography>
        <CopyToClipBoard text={link} style={{ color: 'secondary' }} />
      </div>
    </div>
  );
}
