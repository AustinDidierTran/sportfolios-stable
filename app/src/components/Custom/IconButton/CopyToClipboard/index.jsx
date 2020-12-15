import React, { useState } from 'react';
import { IconButton } from '../..';
import { useTranslation } from 'react-i18next';

export default function CopyToClipBoard(props) {
  const { t } = useTranslation();
  const { text, style, size } = props;
  const [tooltip, setTooltip] = useState(t('copy_to_clipboard'));
  function copyToClipBoard() {
    navigator.clipboard.writeText(text);
    setTooltip('copied!');
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
