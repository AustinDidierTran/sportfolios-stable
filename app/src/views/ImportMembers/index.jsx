import React, { useContext } from 'react';
import { CSVLink } from 'react-csv';
import {
  Paper,
  Button,
  AlertDialog,
  IgContainer,
  List,
  ContainerBottomFixed,
} from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { ExcelRenderer } from 'react-excel-renderer';
import { ACTION_ENUM, Store } from '../../Store';
import {
  LIST_ITEM_ENUM,
  SEVERITY_ENUM,
} from '../../../../common/enums';
import { ListItem, ListItemText } from '../../components/MUI';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import styles from './ImportMembers.module.css';
import {
  validateDateWithYear,
  validateEmail,
} from '../../utils/stringFormats';

export default function ImportMembers() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      members: [],
      fileName: '',
      dialogOpen: false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { members } = values;
      console.log('transfer complete');
      formik.setFieldValue('dialogOpen', false);
    },
  });

  const fileHandler = async event => {
    if (!event.target.files.length) {
      return;
    }
    let fileObj = event.target.files[0];
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
        duration: 2000,
      });
    }
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
    } else {
      formik.setFieldValue('dialogOpen', true);
    }
  };

  const headers = [
    { label: t(''), key: 'emails' },
    { label: t('member_expiration_date'), key: 'day' },
    { label: t(''), key: 'month' },
    { label: t(''), key: 'year' },
  ];
  const dataTemplate = [
    {
      emails: t('emails'),
      day: t('day'),
      month: t('month'),
      year: t('year'),
    },
  ];

  const { dialogOpen, members } = formik.values;

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
            filename={t('import_members')}
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
      <div style={{ marginBottom: 64 }}>
        <List items={members} itemHelpers={{ formik }} />
      </div>
      <AlertDialog
        open={dialogOpen}
        onCancel={() => {
          formik.setFieldValue('dialogOpen', false);
        }}
        title={t('complete_transfer')}
        description={t('import_members_confirmation', {
          membersAmount: members.length,
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
