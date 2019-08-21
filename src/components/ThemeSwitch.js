import React, { PureComponent } from 'react'
import ReactSwitch from 'react-switch'

const Switch = props => <ReactSwitch {...props} />

Switch.defaultProps = {
  checkedIcon: false,
  uncheckedIcon: false,
  height: 24,
  width: 48,
  handleDiameter: 24,
  offColor: `#000`,
  onColor: `#000`,
  boxShadow: `inset 0 0 0 1px #000`,
}

class ThemeSwitch extends PureComponent {
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
      active: 'false',
    }
  }

  isDeclarationSupported(property, value) {
    const prop = property + ':',
      el = document.createElement('test'),
      mStyle = el.style
    el.style.cssText = prop + value
    return mStyle[property]
  }

  toggle = () => {
    this.setState(
      {
        active: !this.state.active,
      },
      () => {
        localStorage.setItem(this.props.storeKey, this.state.active)
      }
    )
  }

  componentDidMount() {
    if (localStorage.getItem(this.props.storeKey)) {
      this.setState({
        active: localStorage.getItem(this.props.storeKey) === 'true',
      })
    }
  }

  render() {
    return (
      <>
        <Switch
          {...this.switchProps}
          onChange={this.toggle}
          checked={!this.state.active}
        />
        <style media={this.state.active ? 'none' : 'screen'}>
          {!this.state.active ? this.css.trim() : this.css}
        </style>
      </>
    )
  }
}

ThemeSwitch.defaultProps = {
  preserveRasters: true,
  storeKey: 'ThemeSwitch',
}

export default ThemeSwitch
