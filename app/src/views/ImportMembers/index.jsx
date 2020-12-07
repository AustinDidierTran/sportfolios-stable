import React, { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  Paper,
  Button,
  AlertDialog,
  IgContainer,
  List,
  ContainerBottomFixed,
  Select,
  LoadingSpinner,
} from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { ExcelRenderer } from 'react-excel-renderer';
import { ACTION_ENUM, Store } from '../../Store';
import {
  LIST_ITEM_ENUM,
  SEVERITY_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums';
import { ListItem, ListItemText } from '../../components/MUI';
import { useFormik } from 'formik';
import styles from './ImportMembers.module.css';
import {
  validateDateWithYear,
  validateEmail,
} from '../../utils/stringFormats';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
import { getMembershipName } from '../../../../common/functions';
import moment from 'moment';
import { ERROR_ENUM } from '../../../../common/errors';

export default function ImportMembers() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id } = useQuery();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    getMemberships();
  }, []);

  const getMemberships = async () => {
    const res = await api(`/api/entity/memberships/?id=${id}`);
    const data = res.data.reduce((prev, curr) => {
      if (!prev.some(p => p.value === curr.membership_type)) {
        const res = {
          display: t(getMembershipName(curr.membership_type)),
          value: curr.membership_type,
        };
        prev.push(res);
      }
      return prev;
    }, []);
    formik.setFieldValue('memberships', data);
    formik.setFieldValue('membership', data[0].value);
  };

  const formik = useFormik({
    initialValues: {
      members: [],
      fileName: '',
      dialogOpen: false,
      memberships: '',
      membership: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { members, membership } = values;
      const language = localStorage.getItem('i18nextLng');
      const res = await api(`/api/entity/importMembers`, {
        method: 'POST',
        body: JSON.stringify({
          membershipType: membership,
          organizationId: id,
          language,
          members: members.map(m => {
            const expirationDate = moment();
            expirationDate.set('year', m.year);
            expirationDate.set('month', m.month - 1);
            expirationDate.set('date', m.day);
            return { email: m.email, expirationDate };
          }),
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        formik.setFieldValue('dialogOpen', false);
        history.back();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('transfer_completed'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 3000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 3000,
        });
      }
    },
  });

  const fileHandler = async event => {
    if (!event.target.files.length) {
      return;
    }
    let fileObj = event.target.files[0];
    if (fileObj.type != 'text/csv') {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('invalid_file_format'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    setIsLoading(true);
    try {
      formik.setFieldValue('fileName', fileObj.name);
      const resp = await ExcelRenderer(fileObj);
      resp.rows.splice(0, 2);
      const rows = resp.rows.map((r, index) => ({
        email: r[0],
        day: r[1],
        month: r[2],
        year: r[3],
        type: LIST_ITEM_ENUM.MEMBER_IMPORT,
        key: index,
      }));
      const tempMembers = formik.values.members;
      rows.forEach(r => {
        if (tempMembers.findIndex(m => r.email === m.email) === -1) {
          tempMembers.push(r);
        }
      });
      formik.setFieldValue('members', tempMembers);
    } catch (err) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: err,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
    setIsLoading(false);
  };

  const completeTransfer = () => {
    const incorrectMembers = formik.values.members.reduce(
      (prev, curr) => {
        if (
          !validateEmail(curr.email) ||
          !validateDateWithYear(
            `${curr.day}/${curr.month}/${curr.year}`,
          )
        ) {
          return prev + 1;
        }
        return prev;
      },
      0,
    );
    if (!formik.values.memberships.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you_need_to_have_a_membership_available'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    if (incorrectMembers > 0) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t(
          'you_still_have_x_members_with_incorrect_information',
          { incorrectMembers },
        ),
        severity: SEVERITY_ENUM.ERROR,
        duration: 5000,
      });
      return;
    }
    formik.setFieldValue('dialogOpen', true);
  };

  const headers = [
    { label: '', key: 'emails' },
    { label: t('member_expiration_date'), key: 'day' },
    { label: '', key: 'month' },
    { label: '', key: 'year' },
  ];
  const dataTemplate = [
    {
      emails: t('emails'),
      day: t('day'),
      month: t('month'),
      year: t('year'),
    },
  ];

  const { dialogOpen, members, memberships } = formik.values;

  return (
    <IgContainer>
      <Paper title={t('import_members')}>
        <ListItem>
          <ListItemText
            primary={t('step_1')}
            secondary={t('download_excel_template')}
          />
          <CSVLink
            data={dataTemplate}
            headers={headers}
            style={{ textDecoration: 'none' }}
            filename={t('import_members') + '.csv'}
          >
            <Button
              variant="outlined"
              endIcon="GetApp"
              style={{ margin: '8px' }}
            >
              {t('download')}
            </Button>
          </CSVLink>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={t('step_2')}
            secondary={t(
              'import_your_excel_sheet_with_all_your_members',
            )}
          />
          <Button
            variant="outlined"
            endIcon="CloudUploadIcon"
            component="label"
            style={{ margin: '8px' }}
          >
            {t('import')}
            <input type="file" onChange={fileHandler} hidden />
          </Button>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={t('step_3')}
            secondary={t('choose_membership')}
          />
          <div className={styles.div}>
            {memberships.length ? (
              <Select
                options={memberships}
                namespace="membership"
                autoFocus
                margin="dense"
                label={t('membership')}
                formik={formik}
              />
            ) : (
              <ListItemText
                primary={t('you_need_to_have_a_membership_available')}
                secondary={t(
                  'you_can_go_to_your_organization_settings_to_add_one',
                )}
                primaryTypographyProps={{ color: 'secondary' }}
              />
            )}
          </div>
        </ListItem>
      </Paper>
      <div>
        <Button
          onClick={() => {
            location.reload();
          }}
          className={styles.button}
          endIcon="Replay"
        >
          {t('reset')}
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ marginBottom: 64 }}>
          <List items={members} formik={formik} />
        </div>
      )}
      <AlertDialog
        open={dialogOpen}
        onCancel={() => {
          formik.setFieldValue('dialogOpen', false);
        }}
        title={t('complete_transfer')}
        description={t('import_members_confirmation', {
          membersAmount: members.length || '',
          membershipName: t(
            getMembershipName(formik.values.membership),
          ),
        })}
        onSubmit={formik.handleSubmit}
      />
      <ContainerBottomFixed>
        <Button onClick={completeTransfer} style={{ margin: 8 }}>
          {t('complete_transfer')}
        </Button>
      </ContainerBottomFixed>
    </IgContainer>
  );
}
