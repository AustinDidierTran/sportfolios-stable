import React, { useEffect, useState } from 'react';
import { Card } from '@material-ui/core';
import api from '../../../actions/api';
import {
  LoadingSpinner,
  List,
  Button,
  AlertDialog,
  IconButton,
} from '../../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function TransferedPeople() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);

  const fetchTransferedPeople = async () => {
    const { data } = await api('/api/user/transferedPeople');
    setPeople(data);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTransferedPeople();
  }, []);

  const closeDeclineDialog = () => {
    setDeclineDialog(false);
  };
  const closeApproveDialog = () => {
    setApproveDialog(false);
  };

  const confirmDecline = () => {
    closeDeclineDialog();
    fetchTransferedPeople();
  };

  const confirmApprove = () => {
    closeApproveDialog();
    fetchTransferedPeople();
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  const actions = person =>
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
              setSelectedPerson(person);
              setApproveDialog(true);
            }}
            color="primary"
          >
            {t('accept')}
          </Button>,
        ]
      : [
          <IconButton
            size="medium"
            onClick={() => {
              setSelectedPerson(person);
              setDeclineDialog(true);
            }}
            style={{ color: 'secondary' }}
            icon="Delete"
          />,
          <IconButton
            size="medium"
            onClick={() => {
              setSelectedPerson(person);
              setApproveDialog(true);
            }}
            style={{ color: 'secondary' }}
            icon="Check"
          />,
        ];

  const items = people.map(person => ({
    ...person,
    photoUrl: person.photo_url,
    completeName: person.name + ' ' + person.surname,
    secondary: t('transfered_to_you'),
    secondaryActions: actions(person),
  }));

  return (
    <>
      <Card style={{ marginTop: 16 }}>
        <List title={t('awaiting_your_approval')} items={items} />
      </Card>
      <AlertDialog
        open={declineDialog}
        onSubmit={confirmDecline}
        onCancel={closeDeclineDialog}
      />
      <AlertDialog
        open={approveDialog}
        onSubmit={confirmApprove}
        onCancel={closeApproveDialog}
      />
    </>
  );
}
