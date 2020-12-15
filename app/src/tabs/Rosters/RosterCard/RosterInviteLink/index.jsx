import React, { useEffect, useState } from 'react';
import { CLIENT_BASE_URL } from '../../../../../../conf';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import {
  STATUS_ENUM,
  ROUTES_ENUM,
} from '../../../../../../common/enums';
import { Button } from '../../../../components/Custom';

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

  return <Button>{link}</Button>;
}
