import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import styles from './Container.module.css';

export default function CustomContainer(props) {
  const [gutters, setGutters] = useState(false);

  const handleResize = () => {
    setGutters(Boolean(window.innerWidth < 768));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  return <Container disableGutters={gutters} {...props} />;
}
