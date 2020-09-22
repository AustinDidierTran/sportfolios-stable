import React from 'react';
import Avatar from '../../Avatar';
import { createRender } from '@material-ui/core/test-utils';

import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

const render = createRender();

describe('<Avatar />', () => {
  beforeEach(() => {});

  it('renders correctly', () => {
    const props = {
      initials: 'ADT',
      photoUrl: 'photo',
    };
    const body = render(<Avatar {...props} />);
    expect(body).toMatchSnapshot();
  });
});
