import React, { useContext, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  Paper,
  Button,
  AlertDialog,
  IgContainer,
  List,
} from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { ExcelRenderer } from 'react-excel-renderer';
import { ACTION_ENUM, Store } from '../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';
import { ListItem, ListItemText } from '../../components/MUI';
// import { useParams } from 'react-router-dom';

export default function ImportMembers() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  // const { id } = useParams();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const fileHandler = event => {
    let fileObj = event.target.files[0];

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: err,
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      } else {
        setFileName(fileObj.name);
        resp.rows.splice(0, 2);
        const rows = resp.rows.map((r, index) => ({
          ...r,
          type: LIST_ITEM_ENUM.MEMBER_IMPORT,
          key: index,
        }));
        setData(rows);
      }
    });
  };
  // console.log({ data });
  const importMembers = () => {};

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

  if (data.length) {
    return (
      <IgContainer>
        <List items={data} />
        <AlertDialog
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          onSubmit={importMembers}
          title={t('complete_transfer')}
          description={t('import_members_confirmation', { fileName })}
        />
      </IgContainer>
    );
  }

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
            </Button>{' '}
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
    </IgContainer>
  );
}
