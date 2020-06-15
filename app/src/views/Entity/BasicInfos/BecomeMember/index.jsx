import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BecomeMember.module.css';

import {
  MEMBERSHIP_TYPE_ENUM,
  ENTITIES_TYPE_ENUM,
} from '../../../../Store';
import { Select } from '../../../../components/Custom';
import api from '../../../../actions/api';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function BecomeMember() {
  const { t } = useTranslation();

  const [isMember, setIsMember] = useState(false);

  // const handleClick = async () => {
  //   const res = await `/api/entity/all?type=${ENTITIES_TYPE_ENUM.PERSON}`;
  //   const isParent = res.length > 1;
  //   if (!isParent) {
  //   }
  // };

  //setIsMember(!isMember);

  const items = [
    { value: 1, display: t('recreational_member') },
    { value: 2, display: t('competitive_member') },
    { value: 3, display: t('elite_member') },
  ];

  const [membership, setMembership] = useState(
    MEMBERSHIP_TYPE_ENUM.ELITE,
  );

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = async event => {
    console.log({ event });
    // await updateMembership(event.target.value);
    setIsMember(true);
  };

  const handleClickMenu = async (event, type) => {
    console.log({ event });
    console.log({ type });
    handleClose();
    setIsMember(true);

    // await addMembership(type);
  };

  const addMembership = async type => {
    const res = await api('/api/entity/addMember', {
      //TODO
      method: 'POST',
      body: JSON.stringify({
        person_id,
        type,
        entity_id,
      }),
    });
    setMembership(res);
  };

  const updateMembership = async type => {
    const res = await api('/api/entity/update_membership', {
      //TODO
      method: 'PUT',
      body: JSON.stringify({
        person_id,
        type,
        entity_id,
      }),
    });
    setMembership(res);
  };

  return isMember ? (
    <Select
      value={membership}
      labelId="Role"
      onChange={e => handleChange(e)}
      options={items}
    />
  ) : (
    <div>
      <Button
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
        variant="contained"
      >
        {t('become_member')}
      </Button>
      <Menu
        id="fade-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {items.map(item => (
          <MenuItem onClick={e => handleClickMenu(e, item.value)}>
            {item.display}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
