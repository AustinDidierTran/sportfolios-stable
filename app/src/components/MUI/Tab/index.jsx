import React, { useState, useEffect } from 'react';
import Tab from '@material-ui/core/Tab';
import { Icon } from '../../Custom';

export default function CustomTab(props) {
  const { icon, label, onClick } = props;
  const [displayText, setDisplayText] = useState(false);

  const handleResize = () => {
    setDisplayText(Boolean(window.innerWidth > 768));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  return displayText ? (
    <Tab
      icon={<Icon icon={icon} />}
      label={label}
      onClick={onClick}
    />
  ) : (
    <Tab
      icon={<Icon icon={icon} />}
      aria-label={label}
      onClick={onClick}
    />
  );
}
