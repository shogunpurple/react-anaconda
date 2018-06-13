import React from 'react';
import Anaconda from 'index';
import { shallow } from 'enzyme';

describe('React anaconda', () => {
  it('wraps a component with the passed wrapper component when the condition is true', () => {
    const wrapper = shallow(<Anaconda 
        when={true}
        wrapper={<div something={true} />}
      />);
    console.log(wrapper.debug());
  });
});
