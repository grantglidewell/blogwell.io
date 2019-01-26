import React, { Component } from 'react'

class ThemeSwitch extends Component {
  constructor(props) {
    super(props)

    this.css = `
      html { filter: invert(100%); background: #fefefe; }
      * { background-color: inherit }
    `

    if (this.props.preserveRasters) {
      this.css +=
        'img:not([src*=".svg"]), video, [style*="url("] { filter: invert(100%) }'
    }

    this.state = {
      active: false,
    }

    this.toggle = this.toggle.bind(this)
  }

  isDeclarationSupported(property, value) {
    const prop = property + ':',
      el = document.createElement('test'),
      mStyle = el.style
    el.style.cssText = prop + value
    return mStyle[property]
  }

  toggle() {
    this.setState(
      {
        active: !this.state.active,
      },
      () => {
        if (localStorage) {
          localStorage.setItem(this.props.storeKey, this.state.active)
        }
      }
    )
  }

  componentDidMount() {
    if (localStorage) {
      this.setState({
        supported: this.isDeclarationSupported('filter', 'invert(100%)'),
        active:
          localStorage.getItem(this.props.storeKey) === 'true'
            ? 'true'
            : 'false',
      })
    }
  }

  render() {
    if (!this.supported) {
      return null
    }

    return (
      <div>
        <button aria-pressed={this.state.active} onClick={this.toggle}>
          {this.state.active ? 'Light' : 'Dark'}
        </button>
        <style media={this.state.active ? 'screen' : 'none'}>
          {this.state.active ? this.css.trim() : this.css}
        </style>
      </div>
    )
  }
}

ThemeSwitch.defaultProps = {
  preserveRasters: true,
  storeKey: 'ThemeSwitch',
}

export default ThemeSwitch
