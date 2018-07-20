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

**react-anaconda** is a tiny (515 bytes) library with utilities for: 
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

ReactDOM.render(<BasicBooleanExample clickable />, document.querySelector('.foo'));
```

#### Rendered Markup
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
  clickable
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
        when={(props) => props.clickable}
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

- The when prop can either be a boolean or a function. 

- If a boolean is passed and is true, children will be wrapped. 

- You can also pass a function to the `when` prop. This function will be used as a predicate and passed each childs props as an argument. If the childs props match the predicate, that child will be wrapped.

### Wrap
`(children: JSX.Element, props: Object) => JSX.Element`

- Wrap is a render prop allowing which has 2 arguments. 
- The first `children` argument is the component that will be wrapped. 
- The second `props` argument is the props of the component to be wrapped as an object. 
- You should return JSX from this function.

## Development

Clone the repo and install dependencies with your favourite package manager. The NPM scripts in the `package.json` are below.

* `build` => builds and minifies the code and outputs a production ready bundle
* `clean` => blows away build folders (`es`, `dist`) for a clean build
* `dev` => runs a `parcel` development server with hot reloading for development. Access the development playground at `localhost:1234`  
* `prepublishOnly` => runs `prepublish:compile` when executing a `npm publish`
* `prepublish:compile` => run `test`, `clean` then `build`
* `test` => runs the jest test suite.
* `test:watch` => run `test` in `watch` mode, which will re-run when you change files pertaining to your tests.
* `contributors:add` => add a contributor to the all-contributorsrc. For example: `npm run contributors:add -- yourusername`. You can then select your contributions.
* `contributors:generate` => generate the new allcontributors file before checking in.
* `contributors:check` => check that the all-contributorsrc reflects all the people who have actually contributed to the project on github.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/11256663?v=4" width="100px;"/><br /><sub><b>Martin McKeaveney</b></sub>](https://github.com/mmckeaveney)<br />[💻](https://github.com/mmckeaveney/react-anaconda/commits?author=mmckeaveney "Code") [📖](https://github.com/mmckeaveney/react-anaconda/commits?author=mmckeaveney "Documentation") [💡](#example-mmckeaveney "Examples") [🤔](#ideas-mmckeaveney "Ideas, Planning, & Feedback") [🚇](#infra-mmckeaveney "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/mmckeaveney/react-anaconda/commits?author=mmckeaveney "Tests") | [<img src="https://avatars0.githubusercontent.com/u/2855748?v=4" width="100px;"/><br /><sub><b>Daniel Skelton</b></sub>](https://github.com/dskelton-r7)<br />[💻](https://github.com/mmckeaveney/react-anaconda/commits?author=dskelton-r7 "Code") [⚠️](https://github.com/mmckeaveney/react-anaconda/commits?author=dskelton-r7 "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!