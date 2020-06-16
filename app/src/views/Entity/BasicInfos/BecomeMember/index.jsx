import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BecomeMember.module.css';

import {
  MEMBERSHIP_TYPE_ENUM,
  ENTITIES_TYPE_ENUM,
} from '../../../../Store';
import { Select, Button } from '../../../../components/Custom';
import { Container } from '../../../../components/MUI';
import api from '../../../../actions/api';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';

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

  const { entity_id } = useParams();

  const [openMemberships, setOpenMemberships] = useState(false);
  const [openPersons, setOpenPersons] = useState(false);

  const handleClick = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const persons = userInfo.persons;
    if (persons.length < 2) {
      setOpenMemberships(true);
    } else {
      setOpenPersons(true);
      console.log('allo');
    }
  };

  const handleCloseMemberships = () => {
    setOpenMemberships(false);
  };

  const handleClosePersons = () => {
    setOpenPersons(false);
  };

  const handleChange = async event => {
    console.log({ event });
    // await updateMembership(event.target.value);
    setIsMember(true);
  };

  const handleClickMenuMemberships = async (event, type) => {
    // await addMembership(type);

    handleClose();
    setIsMember(true);
  };

  const handleClickMenuPersons = async (event, person_id) => {};

  const addMembership = async (type, other_user_id) => {
    const res = await api('/api/entity/member', {
      method: 'POST',
      body: JSON.stringify({
        member_type: type,
        organization_id: entity_id,
        other_user_id,
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
      onChange={handleChange}
      options={items}
      style={{ marginTop: '0px' }}
    />
  ) : (
    <>
      <Button
        onClick={handleClick}
        color="primary"
        variant="contained"
        className={styles.becomeMember}
      >
        {t('become_member')}
      </Button>
      <Menu
        id="fade-menu"
        keepMounted
        open={openMemberships}
        onClose={handleCloseMemberships}
        TransitionComponent={Fade}
      >
        {items.map(item => (
          <MenuItem
            onClick={e => handleClickMenuMemberships(e, item.value)}
          >
            {item.display}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        id="fade-menu"
        keepMounted
        open={openPersons}
        onClose={handleClosePersons}
        TransitionComponent={Fade}
      >
        {persons.map(persons => (
          <MenuItem
            onClick={e => handleClickMenuPersons(e, persons.id)}
          >
            {person.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
