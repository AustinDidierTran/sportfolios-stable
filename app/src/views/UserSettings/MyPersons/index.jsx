import React, { useEffect, useState, useContext } from 'react';
import {
  GLOBAL_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
  FORM_DIALOG_TYPE_ENUM,
} from '../../../../../common/enums';
import { Card } from '@material-ui/core';
import styles from './MyPersons.module.css';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import {
  LoadingSpinner,
  List,
  FormDialog,
  AlertDialog,
  IconButton,
  Button,
} from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import EditPrimaryPerson from './EditPrimaryPerson';
import { Store, ACTION_ENUM } from '../../../Store';
import { ERROR_ENUM, errors } from '../../../../../common/errors';

export default function MyPersons() {
  const { t } = useTranslation();
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPrimaryPerson, setEditPrimaryPerson] = useState(false);
  const [sendPerson, setSendPerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState();
  const [confirmCancelation, setConfirmCancelation] = useState(false);
  const [declineDialog, setDeclineDialog] = useState(false);
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

  const closeCancelPersonTransfer = () => {
    setConfirmCancelation(false);
  };
  const closeDeclineDialog = () => {
    setDeclineDialog(false);
  };

  const showErrorMessage = (
    message = t('something_went_wrong'),
    duration = 4000,
  ) =>
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message,
      severity: SEVERITY_ENUM.ERROR,
      duration,
    });

  const showSuccessMessage = (message, duration = 2000) =>
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message,
      severity: SEVERITY_ENUM.SUCCESS,
      duration,
    });

  const confirmDecline = async () => {
    const res = await api(
      formatRoute('/api/user/declinePersonTransfer', null, {
        id: selectedPerson.id,
      }),
    );
    if (res.status === STATUS_ENUM.ERROR) {
      showErrorMessage();
    } else {
      showSuccessMessage(t('person_transfer_declined'));
    }
    closeDeclineDialog();
    fetchOwnedPersons();
  };

  const approveTransfer = async person => {
    const res = await api(
      formatRoute('/api/user/acceptPersonTransfer', null, {
        id: person.id,
      }),
    );
    if (res.status === STATUS_ENUM.ERROR) {
      showErrorMessage();
    } else {
      showSuccessMessage(t('person_transfer_done'));
    }
    fetchOwnedPersons();
  };

  const confirmCancelPersonTransfer = async () => {
    const res = await api(
      formatRoute('/api/user/transferPerson', null, {
        id: selectedPerson.id,
      }),
      { method: 'DELETE' },
    );
    if (res.status === STATUS_ENUM.ERROR) {
      showErrorMessage(res.message);
    } else {
      showSuccessMessage(t('person_transfer_canceled'));
    }
    closeCancelPersonTransfer();
    fetchOwnedPersons();
  };

  const onSendEmail = async email => {
    const res = await api('/api/user/transferPerson', {
      method: 'POST',
      body: JSON.stringify({
        email,
        sendedPersonId: selectedPerson.id,
      }),
    });
    if (res.status === errors[ERROR_ENUM.VALUE_IS_INVALID].code) {
      showErrorMessage(t('cant_transfer_person_to_your_own_email'));
    } else if (res.status == STATUS_ENUM.ERROR) {
      showErrorMessage();
    } else {
      showSuccessMessage(
        t('person_transfer_email_sent', { email }),
        3000,
      );
    }
    closeSendPerson();
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
        showErrorMessage();
      } else {
        showSuccessMessage(t('primary_person_changed'));
        fetchOwnedPersons();
      }
    }
    setEditPrimaryPerson(false);
  };

  useEffect(() => {
    fetchOwnedPersons();
  }, []);

  const transferedPersonActions = person => [
    <IconButton
      tooltip={t('cancel_person_transfer')}
      edge="end"
      onClick={() => {
        setSelectedPerson(person);
        setConfirmCancelation(true);
      }}
      icon="CancelSend"
      style={{ color: 'secondary' }}
      size="medium"
    />,
  ];

  const primaryPersonActions = () => [
    <IconButton
      tooltip={t('edit_your_primary_person')}
      edge="end"
      onClick={() => {
        setEditPrimaryPerson(true);
      }}
      icon="Edit"
      style={{ color: 'secondary' }}
      size="medium"
    />,
  ];

  const secondaryPersonActions = person => [
    <IconButton
      tooltip={t('transfer_this_person')}
      edge="end"
      onClick={() => {
        setSelectedPerson(person);
        setSendPerson(true);
      }}
      icon="Send"
      style={{ color: 'secondary' }}
      size="medium"
    />,
  ];

  const awaitingApprovalPersonAction = person =>
    window.innerWidth >= 768
      ? [
          <Button
            endIcon="Delete"
            size="small"
            onClick={() => {
              setSelectedPerson(person);
              setDeclineDialog(true);
            }}
            color="secondary"
            style={{ marginRight: 5 }}
          >
            {t('decline')}
          </Button>,
          <Button
            endIcon="Check"
            size="small"
            onClick={() => {
              approveTransfer(person);
            }}
            color="primary"
          >
            {t('accept')}
          </Button>,
        ]
      : [
          <IconButton
            tooltip={t('cancel')}
            size="medium"
            onClick={() => {
              setSelectedPerson(person);
              setDeclineDialog(true);
            }}
            style={{ color: 'secondary' }}
            icon="Delete"
          />,
          <IconButton
            tooltip={t('confirm')}
            size="medium"
            onClick={() => {
              approveTransfer(person);
            }}
            style={{ color: 'secondary' }}
            icon="Check"
          />,
        ];

  const items = persons.map(person => {
    let subtitle;
    let actions;
    if (person.isPrimaryPerson) {
      subtitle = t('primary_person');
      actions = primaryPersonActions();
    } else if (person.isToBeTransfered) {
      subtitle = t('person_awaiting_transfer');
      actions = transferedPersonActions(person);
    } else if (person.isAwaitingApproval) {
      subtitle = t('awaiting_your_approval');
      actions = awaitingApprovalPersonAction(person);
    } else {
      subtitle = t('secondary_person');
      actions = secondaryPersonActions(person);
    }
    return {
      ...person,
      completeName: person.name + ' ' + person.surname,
      secondary: subtitle,
      secondaryActions: actions,
      key: person.id,
    };
  });

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <>
      <Card className={styles.card}>
        <List title={t('my_persons')} items={items} />
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
        onSubmit={confirmCancelPersonTransfer}
        onCancel={closeCancelPersonTransfer}
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
      <AlertDialog
        open={declineDialog}
        title={t('cancel_person_transfer_confirmation', {
          name: selectedPerson
            ? selectedPerson.name + ' ' + selectedPerson.surname
            : '',
        })}
        onSubmit={confirmDecline}
        onCancel={closeDeclineDialog}
      />
    </>
  );
}
