import React, { useState, useContext, useMemo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import { ERROR_ENUM } from '../../../../../../../common/errors';
import api from '../../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../../../../common/enums';
import { useEffect } from 'react';
import PersonSearchList from '../../../SearchList/PersonSearchList';
import { useFormInput } from '../../../../../hooks/forms';
import PersonItem from '../../../List/PersonItem';

export default function AddPlayer(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    open: openProps,
    rosterId,
    onClose,
    updateRoster,
    fullRoster,
  } = props;
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState(null);
  const query = useFormInput('');

  const blackList = useMemo(() => {
    if (fullRoster) {
      return fullRoster.map(r => r.value);
    }
  }, [fullRoster]);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleClose = player => {
    setPerson(null);
    onClose();
    if (player.id) {
      updateRoster(player);
    }
  };

  const onClick = player => {
    setPerson(player);
  };

  const onPlayerAddToRoster = async () => {
    const res = await api('/api/entity/addPlayerToRoster', {
      method: 'POST',
      body: JSON.stringify({
        name: person.completeName || person.name,
        isSub: true,
        rosterId,
        personId: person.id,
      }),
    });
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('player_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      handleClose(res.data[0]);
    }
  };
  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: onPlayerAddToRoster,
      name: t('add'),
      color: 'primary',
      disabled: person ? false : true,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth={'xs'}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        {t('add_player')}
      </DialogTitle>
      <div>
        <DialogContent>
          {person ? (
            <PersonItem
              {...person}
              secondary={t('player')}
              notClickable
            />
          ) : (
            <></>
          )}
          <PersonSearchList
            clearOnSelect={false}
            blackList={blackList}
            label={t('enter_player_name')}
            query={query}
            allowCreate
            withoutIcon
            autoFocus
            onClick={onClick}
            handleClose={handleClose}
            rosterId={rosterId}
          />
        </DialogContent>
        <DialogActions>
          {buttons.map((button, index) => (
            <Button
              onClick={button.onClick}
              color={button.color}
              type={button.type}
              key={index}
              disabled={button.disabled}
            >
              {button.name}
            </Button>
          ))}
        </DialogActions>
      </div>
    </Dialog>
  );
}
