import React from 'react';

const defaultWrap = (children) => children;

export default ({ when, wrap = defaultWrap, children, ...rest }) => {
  const Container = React.Fragment || React.createElement('div');

  return (
    <Container>
      {React.Children.map(children, child => {
        if (
          typeof when === 'function' && when(child.props) ||
          when === true
        ) {
          child = wrap(child, child.props);
        }
        return rest ? React.cloneElement(child, rest) : child;
      })}
    </Container>
  );
};
