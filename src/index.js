import React from 'react';

const Anaconda = ({ when, wrap, children, ...rest }) => {
  const Container = React.Fragment || React.createElement('div');

  // For each child
  return (
    <Container>
      {React.Children.map(children, child => {
        if (
          typeof when === 'function' && when(child.props) ||
          when === true
        ) {
          child = wrap(child);
        }
        return rest ? React.cloneElement(child, rest) : child;
      })}
    </Container>
  );
};

export default Anaconda;
