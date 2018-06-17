import React from 'react';
import ReactDOM from 'react-dom';
import Anaconda from '../src';

const url = 'http://cool-url.com';

const AnacondaDev = ({ clickable }) => {
  return (
    <Anaconda
      when={clickable}
      wrap={children => <a href={url}>{children}</a>}>
      <span> Click me! </span>
      <span> And me! </span>
      <span> Me Three! </span>
      <span> Me Four! </span>
    </Anaconda>
  );
};

ReactDOM.render(<AnacondaDev clickable />, document.querySelector('.root'));
