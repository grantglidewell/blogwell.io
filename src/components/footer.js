import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Footer = ({ siteTitle }) => (
  <div
    style={{
      background: `rgb(125, 88, 158)`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0, height: '3vh' }}>
        <Link
          to="/"
          style={{
            color: `#222`,
            textDecoration: `none`,
            fontWeight: '200',
            fontSize: '1rem',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
