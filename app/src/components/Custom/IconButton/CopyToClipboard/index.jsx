import React, { useState, useContext } from 'react';
import { Button, IconButton } from '../..';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM } from '../../../../../../common/enums';

export default function CopyToClipBoard(props) {
  const { t } = useTranslation();
  const {
    text,
    copyText,
    style,
    size,
    snackBarText,
    tooltip: tooltipProp,
  } = props;
  const [tooltip, setTooltip] = useState(
    tooltipProp || t('copy_to_clipboard'),
  );
  const { dispatch } = useContext(Store);
  function copyToClipBoard() {
    navigator.clipboard.writeText(copyText);
    showSnackBar();
    setTooltip(t('copied') + '!');
  }

  function showSnackBar() {
    if (snackBarText) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: snackBarText,
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
    }
  }
  if (text) {
    return (
      <Button
        startIcon="Link"
        variant="text"
        onClick={copyToClipBoard}
        style={style}
      >
        {text}
      </Button>
    );
  }
  return (
    <IconButton
      icon="FileCopy"
      onClick={copyToClipBoard}
      style={style}
      tooltip={tooltip}
      size={size}
    ></IconButton>
  );
}
