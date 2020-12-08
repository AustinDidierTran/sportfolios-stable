import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  COMPONENT_TYPE_ENUM,
  FIELD_GROUP_ENUM,
} from '../../../common/enums';
import moment from 'moment';

export const useFields = (type, options) => {
  const { t } = useTranslation();
  const field = useMemo(() => {
    if (type === FIELD_GROUP_ENUM.ADD_PAYMENT_OPTION) {
      const {
        teamActivity,
        ownersId,
        allTaxes,
        onChange,
        teamPriceTotal,
        playerPriceTotal,
        taxes,
        handleChange,
      } = options;
      return [
        {
          namespace: 'name',
          label: t('name'),
          type: 'text',
        },
        {
          componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
          checked: teamActivity,
          namespace: 'teamActivity',
          label: t('team_activity'),
          onChange: onChange,
        },
        teamActivity
          ? {
              namespace: 'teamPrice',
              label: t('price_team'),
              type: 'number',
              endAdorment: '$',
            }
          : { componentType: COMPONENT_TYPE_ENUM.EMPTY },
        teamActivity
          ? {
              componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
              secondary: t('with_taxes_the_total_for_a_team_is', {
                total: teamPriceTotal,
              }),
            }
          : { componentType: COMPONENT_TYPE_ENUM.EMPTY },
        {
          namespace: 'playerPrice',
          label: t('price_individual'),
          type: 'number',
          endAdorment: '$',
        },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          secondary: t('with_taxes_the_total_for_a_player_is', {
            total: playerPriceTotal,
          }),
        },
        ownersId.length
          ? {
              namespace: 'ownerId',
              label: t('payment_option_owner'),
              componentType: COMPONENT_TYPE_ENUM.SELECT,
              options: ownersId,
            }
          : {
              componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
              primary: t('no_admins_with_bank_account'),
            },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          secondary: t(
            'all_the_admins_of_the_event_that_have_a_bank_account_linked_to_their_account_will_appear_here',
          ),
        },
        {
          componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
          namespace: 'taxes',
          label: t('taxes'),
          options: allTaxes.map(a => a.display),
          values: taxes,
          onChange: handleChange,
        },
        {
          namespace: 'openDate',
          label: t('registration_open_date'),
          type: 'date',
          initialValue: moment().format('YYYY-MM-DD'),
          shrink: true,
        },
        {
          namespace: 'openTime',
          label: t('registration_open_time'),
          type: 'time',
          initialValue: '00:00',
          shrink: true,
        },
        {
          namespace: 'closeDate',
          label: t('registration_close_date'),
          type: 'date',
          shrink: true,
        },
        {
          namespace: 'closeTime',
          label: t('registration_close_time'),
          type: 'time',
          initialValue: '23:59',
          shrink: true,
        },
      ];
    }
  }, [type, options]);
  return field;
};
