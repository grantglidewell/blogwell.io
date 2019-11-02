import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const IndexPage = props => {
  const postList = props.data.allMarkdownRemark
  return (
    <Layout>
      <div className="post-wrap">
        {postList.edges.map(({ node }, i) => (
          <Link to={node.fields.slug} key={i} className="link">
            <div className="post-list">
              <h2>{node.frontmatter.title}</h2>
              <span>{node.frontmatter.date}</span>
              <p>{node.frontmatter.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
export default IndexPage
export const listQuery = graphql`
  query ListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-Do")
            title
            description
          }
        }
      }
    }
  }
`
