import React, { useEffect, useState, useContext } from 'react';
import {
  GLOBAL_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Card } from '@material-ui/core';
import styles from './MyPersons.module.css';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import {
  LoadingSpinner,
  List,
  FormDialog,
  AlertDialog,
} from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import EditPrimaryPerson from './EditPrimaryPerson';
import { Store, ACTION_ENUM } from '../../../Store';

export default function MyPersons() {
  const { t } = useTranslation();
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPrimaryPerson, setEditPrimaryPerson] = useState(false);
  const [sendPerson, setSendPerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState();
  const [confirmCancelation, setConfirmCancelation] = useState(false);
  const { dispatch } = useContext(Store);

  const fetchOwnedPersons = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      }),
    );
    //Permet de mettre la primary person comme 1er élément de la liste
    for (var i = 0; i < data.length; i++) {
      if (data[i].isPrimaryPerson) {
        data.unshift(data.splice(i, 1)[0]);
        break;
      }
    }
    setPersons(data);
    setIsLoading(false);
  };

  const closeEditPrimaryPerson = () => {
    setEditPrimaryPerson(false);
  };

  const closeSendPerson = () => {
    setSendPerson(false);
  };

  const closePersonTransfer = () => {
    setConfirmCancelation(false);
  };

  const confirmPersonTransfer = async () => {
    console.log('confirm');
    await api(
      formatRoute('/api/user/transferPerson', null, {
        id: selectedPerson.id,
      }),
      { method: 'DELETE' },
    );
    closePersonTransfer();
    fetchOwnedPersons();
  };

  const onSendEmail = async email => {
    closeSendPerson();
    await api('/api/user/transferPerson', {
      method: 'POST',
      body: JSON.stringify({
        email,
        sendedPersonId: selectedPerson.id,
      }),
    });
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('person_transfer_email_sent', { email }),
      severity: SEVERITY_ENUM.SUCCES,
      duration: 3000,
    });
    fetchOwnedPersons();
  };

  const submitPrimaryPerson = async newPrimaryPersonId => {
    if (persons[0].id !== newPrimaryPersonId) {
      const res = await api('/api/user/primaryPerson', {
        method: 'PUT',
        body: JSON.stringify({
          primaryPersonId: newPrimaryPersonId,
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
          message: t('primary_person_changed'),
          severity: SEVERITY_ENUM.SUCCES,
          duration: 2000,
        });
        fetchOwnedPersons();
      }
    }
    setEditPrimaryPerson(false);
  };

  useEffect(() => {
    fetchOwnedPersons();
  }, []);

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <>
      <Card className={styles.card}>
        <List
          title={t('my_persons')}
          items={persons.map(person => {
            let subtitle;
            let icon;
            let onIconClick;
            if (person.isPrimaryPerson) {
              subtitle = t('primary_person');
              icon = 'Edit';
              onIconClick = () => setEditPrimaryPerson(true);
            } else if (person.isToBeTransfered) {
              subtitle = t('person_awaiting_transfer');
              icon = 'CancelSend';
              onIconClick = person => {
                setSelectedPerson(person);
                setConfirmCancelation(true);
              };
            } else {
              subtitle = t('secondary_person');
              icon = 'Send';
              onIconClick = person => {
                setSelectedPerson(person);
                setSendPerson(true);
              };
            }
            return {
              ...person,
              completeName: person.name + ' ' + person.surname,
              secondary: subtitle,
              iconButton: icon,
              onIconButtonClick: () => onIconClick(person),
            };
          })}
        />
      </Card>
      <EditPrimaryPerson
        open={editPrimaryPerson}
        persons={persons}
        handleClose={closeEditPrimaryPerson}
        handleSubmit={submitPrimaryPerson}
      />
      <AlertDialog
        open={confirmCancelation}
        title={t('cancel_person_transfer_confirmation', {
          name: selectedPerson
            ? selectedPerson.name + ' ' + selectedPerson.surname
            : '',
        })}
        onSubmit={confirmPersonTransfer}
        onCancel={closePersonTransfer}
      />
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ENTER_EMAIL}
        items={{
          open: sendPerson,
          onClose: closeSendPerson,
          title:
            t('to_transfer') +
            (selectedPerson
              ? ' ' +
                selectedPerson.name +
                ' ' +
                selectedPerson.surname
              : ''),
          description: t('transfer_person_description'),
          onSubmit: onSendEmail,
        }}
      />
    </>
  );
}
