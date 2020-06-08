import React from 'react';
import Avatar from '../../Avatar';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const props = {
    initials: 'ADT',
    photoUrl: 'photo',
  };

  const tree = renderer.create(<Avatar {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
