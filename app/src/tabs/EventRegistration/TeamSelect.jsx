import React from 'react';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { SearchList, Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import TeamItem from '../../components/Custom/List/TeamItem';
import { ROUTES, goTo } from '../../actions/goTo';
import styles from './TeamSelect.module.css';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const { onClick, team } = props;
  const query = useFormInput('');

  const onCreate = () => {
    goTo(ROUTES.create, null, { type: GLOBAL_ENUM.TEAM });
  };

  if (team) {
    return (
      <div className={styles.main}>
        <TeamItem
          {...team}
          secondary="Selected Team"
          className={styles.main}
        />
        <SearchList
          className={styles.item}
          label={t('select_team')}
          type={GLOBAL_ENUM.TEAM}
          onClick={onClick}
          query={query}
        />
        <Button
          className={styles.item}
          size="small"
          variant="contained"
          endIcon="Add"
          style={{ margin: '8px' }}
          onClick={onCreate}
        >
          {t('create_team')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <SearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('select_team')}
        type={GLOBAL_ENUM.TEAM}
        onClick={onClick}
        query={query}
      />
      <Button
        className={styles.item}
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={onCreate}
      >
        {t('create_team')}
      </Button>
    </div>
  );
}
