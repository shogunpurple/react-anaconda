import React from 'react';
import Anaconda from 'index';
import { shallow } from 'enzyme';

describe('React Anaconda', () => {
  describe('if the when condition is true and is a boolean', () => {
    it('wraps a component with the passed wrapper component', () => {
      const wrapper = shallow(
        <Anaconda
          when
          wrap={children => <div className="wrapper">{children}</div>}>
          <span>Should wrap </span>
        </Anaconda>
      );
      expect(wrapper.find('.wrapper')).toHaveLength(1);
      expect(wrapper.find('span')).toHaveLength(1);
    });
  });

  describe('if the when condition is a predicate function and the childs props satisfy the predicate', () => {
    it('wraps a child component with the passed wrapper component', () => {
      const wrapper = shallow(
        <Anaconda
          when={props => props.shouldWrap && props.numPeople > 2}
          wrap={children => <div className="wrapper">{children}</div>}>
          <span shouldWrap numPeople={3} />
        </Anaconda>
      );

      expect(wrapper.find('.wrapper')).toHaveLength(1);
    });

    it('wraps a component with the passed wrapper component when children are an array of elements themselves', () => {
      const wrapper = shallow(
        <Anaconda
          wrap={children => <div className="wrapper">{children}</div>}
          when={props => props.shouldWrap && props.numPeople > 2}>
          {[1, 2, 3].map(number => (
            <span key={number} shouldWrap numPeople={number} />
          ))}
        </Anaconda>
      );

      expect(wrapper.find('.wrapper')).toHaveLength(1);
    });
  });

  describe('if the when condition is false', () => {
    it('returns the component as normal', () => {
      const wrapper = shallow(
        <Anaconda
          when={false}
          wrap={children => <div className="wrapper">{children}</div>}>
          <div className="unwrapped" />
        </Anaconda>
      );
      expect(wrapper.find('.wrapper')).toHaveLength(0);
      expect(wrapper.find('.unwrapped')).toHaveLength(1);
    });
  });

  describe('when other custom props are passed', () => {
    it('the rest of the props are passed through to each child component', () => {
      const wrapper = shallow(
        <Anaconda name="foo">
          <div className="unwrapped" />
          <div className="unwrapped" />
          <div className="unwrapped" />
        </Anaconda>
      );

      wrapper.find('.unwrapped').forEach(node => {
        expect(node.props().name).toBe('foo');
      });
    });
  });
});