import React, { useEffect, useState } from 'react';

import PlacesAutocomplete from 'react-places-autocomplete';
import { useTranslation } from 'react-i18next';

import { GOOGLE_PLACES_API_KEY } from '../../../../../conf';
import { LOGO_ENUM } from '../../../../../common/enums';
import styles from './AddressSearchInput.module.css';

export default function AddressSearchInput() {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');

  const handleSelect = address => {
    console.log(`Selected ${address}`);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={() => setAddress(address)}
      onSelect={handleSelect}
      shouldFetchSuggestions={address?.length > 3}
      debounce={400}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => {
        return (
          <div className={styles.searchBarContainer}>
            <div className={styles.searchInputContainer}>
              <input
                {...getInputProps({
                  placeholder: t('type_address'),
                  className: styles.searchInput,
                })}
              />
              {address?.length > 0 && (
                <button
                  className={styles.clearButton}
                  onClick={() => setAddress('')}
                >
                  x
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <div className={styles.autocompleteContainer}>
                {suggestions.map(suggestion => {
                  /*const className = classnames({styles.suggestion-item}, {
                    {styles.suggestion-item--active}: suggestion.active,
                });*/

                  return (
                    <div
                    //{...getSuggestionItemProps(suggestion, { className })}
                    >
                      <strong>
                        {suggestion.formattedSuggestion.mainText}
                      </strong>{' '}
                      <small>
                        {suggestion.formattedSuggestion.secondaryText}
                      </small>
                    </div>
                  );
                })}
                <div className={styles.dropdownFooter}>
                  <div>
                    <img
                      src={LOGO_ENUM.POWERED_BY_GOOGLE}
                      alt="powered by Google"
                      className={styles.dropdownFooterImage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

/*
<PlacesAutocomplete
      value={address}
      onChange={() => setAddress(address)}
      onSelect={handleSelect}
      shouldFetchSuggestions={address?.length > 3}
      debounce={400}
    >
      {({
        getInputProps,
        suggestions,
        getSuggestionItemProps,
        loading,
      }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: t('type_address'),
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </PlacesAutocomplete>
        */
