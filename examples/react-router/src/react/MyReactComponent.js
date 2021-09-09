import ReactDOM from 'react-dom'
import React from 'react'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'

export function MyReactComponent() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      'div',
      null,
      'This is a react component with react-router',
      React.createElement('br', null),
      React.createElement(Link, { to: '/user/alain' }, 'Go to user'),
      ' ',
      React.createElement(Link, { to: '/home' }, 'Hide details'),
      ' ',
      React.createElement(Link, { to: '/home/details' }, 'Show details'),
      React.createElement('br', null),
      React.createElement(
        Switch,
        null,
        React.createElement(
          Route,
          { path: '/home/details' },
          'Here are the details'
        )
      )
    )
  )
}

class MyReactElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span')
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint)
    ReactDOM.render(
      React.createElement(MyReactComponent, null, null),
      mountPoint
    )
  }
}
customElements.define('my-react-element', MyReactElement)
