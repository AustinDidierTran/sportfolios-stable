import React, { useState, useEffect, useRef } from 'react';

import { GOOGLE_PLACES_API_KEY } from '../../../../../conf';
import { useTranslation } from 'react-i18next';
import styles from './AddressSearchInput.module.css';
import uuid from 'uuid';

// REFERENCE: https://medium.com/better-programming/the-best-practice-with-google-place-autocomplete-api-on-react-939211e8b4ce

let autoComplete;

function AddressSearchInput(props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  /* eslint-disable-next-line */
  const [address, setAddress] = useState({});
  const autoCompleteRef = useRef(null);
  const { language: languageProp } = props;

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef),
    );
  }, []);

  const loadScript = (url, callback) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) {
      script.onreadystatechange = function() {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  function handleScriptLoad(updateQuery, autoCompleteRef) {
    const options = {
      sessiontoken: uuid.v4(),
      types: ['address'],
      componentRestrictions: { country: 'ca' },
      language: `${languageProp}`,
      //radius: 50000,
      //location: `45.404476, -71.888351`, // Location biasis: search around this (doesn't seem to work...)
    };

    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      options,
    );
    autoComplete.setFields([
      'address_components',
      'formatted_address',
    ]);
    autoComplete.addListener('place_changed', () =>
      handlePlaceSelect(updateQuery),
    );
  }

  async function handlePlaceSelect(updateQuery) {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);
    const fullAddress = addressObject.address_components;
    setAddress({
      street_address: `${fullAddress[0].long_name} ${fullAddress[1].long_name}`,
      city: fullAddress[3].long_name,
      state: fullAddress[5].short_name,
      country: fullAddress[6].short_name,
      zip: fullAddress[7].short_name,
    });
  }

  return (
    <div className={styles.searchLocationInput}>
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder={t('address')}
        value={query}
      />
    </div>
  );
}

export default AddressSearchInput;
