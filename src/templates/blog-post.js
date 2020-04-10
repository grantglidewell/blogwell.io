import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

import './blog.css'

function BlogPost(props) {
  const post = props.data.markdownRemark
  const { title } = post.frontmatter
  return (
    <Layout title={title}>
      <main className="wrapper">
        <div className="blogpost">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </main>
    </Layout>
  )
}

export default BlogPost
export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
      }
    }
  }
`
