# react-anaconda :snake:

> Conditionally wrap react components and implicitly share props amongst children.

[![npm](https://img.shields.io/npm/v/react-anaconda.svg)](https://www.npmjs.com/package/react-anaconda)
[![license](https://img.shields.io/github/license/mmckeaveney/react-anaconda.svg)](https://github.com/mmckeaveney/react-anaconda/blob/master/LICENSE)


- [react-anaconda](#react-anaconda)
    - [Rationale](#rationale)
    - [Installation](#installation)
    - [Examples](#examples)
    - [API](#api)
    - [Development](#development)

## Rationale
Sometimes, you need to conditionally wrap a react component. This can be useful for tooltips, coachmarks and links/anchor tags, as well as for higher order component or render prop patterns. 
When we need to wrap a react component conditionally we usually do something like the following inside our `render` method:

```js
const child = (
  <i className='cool-icon'>
     Hello! 
  </i>
);

if (this.props.link) {
  return (
    <a href={this.props.link}>
      {child}
    </a>
  );
}

return child;

```

**react-anaconda** is a small library with utilities for: 
- conditionally wrapping react components
- Implicit prop sharing across children 

Using react-anaconda, we could rewrite the previous example like this: 

```js
import Anaconda from 'react-anaconda';

return (
  <Anaconda
    when={this.props.link}
    wrap={(children) => <a href={this.props.link}>{children}</a>}
  > 
    <i className='cool-icon'>
       Hello! 
    </i>
  </Anaconda>
)
```

This is the most basic example. react-anaconda also works with lists and conditional wrapping based on child props. Check out the [examples](#examples) for more.


## Installation
**npm**
```
npm i react-anaconda 
```

**yarn**
```
yarn add react-anaconda 
```

## Examples
### Wrap all children with a wrapper component based on a boolean value 

#### Component 
```js
import React, { Component } from 'react';
import Anaconda from 'react-anaconda';

class BasicBooleanExample extends Component {
  render() {
    return (
      <Anaconda
        when={this.props.clickable}
        wrap={(children) => <a href="http://cool-url.com">{children}</a>}
      > 
        <span> Click me! </span>
        <span> And me! </span>
        <span> Me Three! </span>
        <span> Me Four! </span>
      </Anaconda>
    )
  }
}

ReactDOM.render(<BasicBooleanExample />, document.querySelector('.foo'));
```

#### Returned Markup
```html
  <a href="http://cool-url.com"> <span> Click me! </span> </a>
  <a href="http://cool-url.com"> <span> And me! </span> </a>
  <a href="http://cool-url.com"> <span> Me Three! </span> </a>
  <a href="http://cool-url.com"> <span> Me Four! </span> </a>
```

### Wrap all mapped children with a wrapper component based on a boolean value  
#### Component 
```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Anaconda from 'react-anaconda';

class MapBooleanExample extends Component {
  render() {
    return (
      <Anaconda
        when={this.props.clickable}
        wrap={children => <a href="http://cool-url.com">{children}</a>}
        > 
        {this.props.linkNames.map((linkText) => <span>{linkText}</span>)}
      </Anaconda>
    )
  }
}

ReactDOM.render(
<MapBooleanExample 
  linkNames={[
    'Click me!',
    'And me!',
    'Me Three!',
    'Me Four!'
  ]}
/>, document.querySelector('.foo'));
```

#### Rendered Markup 
```html
<a href="http://cool-url.com"> <span> Click me! </span> </a>
<a href="http://cool-url.com"> <span> And me! </span> </a>
<a href="http://cool-url.com"> <span> Me Three! </span> </a>
<a href="http://cool-url.com"> <span> Me Four! </span> </a>
```

### Wrap children with a wrapper component if their props match a predicate

When you pass a function to the `when` prop, react-anaconda will check the actual props of each child against that function. If the predicate is true, that child will be wrapped. Consider the following (slightly contrived) example.
#### Component 
```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Anaconda from 'react-anaconda';

class PropPredicateExample extends Component {
  render() {
    return (
      <Anaconda
          when={(props) => props.numPeople > 1}
          wrap={children => <div className="moreThanOne">{children}</div>}
      > 
        {this.props.bookings.map(({ numPeople }) => (
          <span numPeople={numPeople}> 
            {numPeople} {numPeople === 1 ? 'person' : 'people'} 
          </span>)
        )}
      </Anaconda>
    )
  }
}

ReactDOM.render(
<PropPredicateExample 
  bookings={[
    { numPeople: 1 },
    { numPeople: 2 },
    { numPeople: 1 },
    { numPeople: 3 },
    { numPeople: 1 },
    { numPeople: 4 },
    { numPeople: 5 }
  ]}
/>, document.querySelector('.foo'));
```
---
Note this also works with normal children that aren't mapped. This is useful if you have a few different types of elements you want to conditionally wrap. Also notice how the second argument of `wrap` will receive the child props so you can use them in your wrapper.
#### Component 
```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Anaconda from 'react-anaconda';

class PropPredicateExample extends Component {
  render() {
    return (
      <Anaconda
        when={(props) => props.link}
        wrap={(children, props) => <a href={props.link}>{children}</a>}
      > 
      <span link="http://cool-url.com">Span</span>
      <button link="http://other-cool-url.com">Button</span>
      <article>Article</span>
      </Anaconda>
    )
  }
}

ReactDOM.render(<PropPredicateExample />, document.querySelector('.foo'));
```

#### Rendered Markup 
```html
<a href="http://cool-url.com"><span> Span </span></a>
<a href="http://other-cool-url.com"><button> Button </button></a>
<article> Article </article>

```

### Spread custom props implicitly across child components
Any props that you pass to react-anaconda apart from the `when` and `wrap` components will be shared amongst all children. Consider the following:

#### Component
```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Anaconda from 'react-anaconda';

const NameBar = ({ name, bar }) => <span>{name}:{bar}</span>;

const BarName = ({ name, bar }) => <span>{bar}:{name}</span>;

class PropShareExample extends Component {
  render() {
    return (
      <Anaconda
        when={this.props.clickable}
        wrap={(children) => <a href="http://cool-url.com">{children}</a>}
        name="foo"
        bar={5}
      > 
        {/* All these children will receive the name and bar props */}
        <NameBar clickable />
        <BarName />
      </Anaconda>
    )
  }
}

ReactDOM.render(<PropShareExample />, document.querySelector('.foo'));
```
#### Rendered Markup 
```html
<a href="http://cool-url.com"><span>foo:5</span></a>
<span>5:foo</span>
```

## API

### When
`Boolean | (props: Object) => Boolean`

### Wrap
`(children: JSX.Element, props: Object) => JSX.Element`

## Development

Clone the repo and install dependencies with your favourite package manager. The NPM scripts in the `package.json` are below.

* `build:minified` => builds and minifies the code and outputs a production ready bundle
* `clean` => blows away build folders (`lib`, `dist`) for a clean build
* `dev` => runs a `parcel` development server with hot reloading for development. Access the development playground at `localhost:1234`  
* `prepublish` => runs `prepublish:compile` when executing a `npm publish`
* `prepublish:compile` => run `clean`, `transpile` and then `build:minified`
* `test` => runs the jest test suite.
* `test:watch` => run `test` in `watch` mode, which will re-run when you change files pertaining to your tests.
* `test:update` => run `test`, but update outdated jest snapshots  
* `transpile` => transpile all files in `src` into the `lib` folder using babel
* `contributors:add` => add a contributor to the all-contributorsrc. For example: `npm run contributors:add -- yourusername`. You can then select your contributions.
* `contributors:generate` => generate the new allcontributors file before checking in.
* `contributors:check` => check that the all-contributorsrc reflects all the people who have actually contributed to the project on github.
