import React /*, { useState, useEffect, useContext } */ from 'react';
import { useParams } from 'react-router-dom';
//import api from '../../actions/api';
//import styles from './EditPersonInfos.module.css';
//import { useTranslation } from 'react-i18next';

export default function EditPersonInfos() {
  //const { t } = useTranslation();
  const { id: personId } = useParams();
  //const { dispatch } = useContext(Store);

  return <h1>{personId}</h1>;
}
