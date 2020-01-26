module.exports = {
  siteMetadata: {
    title: `Grant Glidewell | Blog`,
    siteUrl: `https://blogwell.io`,
    description: `Grant Glidewell is a JavaScript engineer living in San Diego, CA. He loves science fiction, dogs, and coffee.`,
    author: `@grantglidewell`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-feed-generator`,
      options: {
        json: true,
        siteQuery: `
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author
        }
      }
    }
  `,
        feeds: [
          {
            name: `feed`,
            query: `
      {allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
        nodes {
          frontmatter {
            author
            description
            title
            date(formatString: "MM-DD-YYYY")
          }
          fields {
            slug
          }
        }
      }}
      `,
            normalize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return {
                  title: node.frontmatter.title,
                  date: node.frontmatter.date,
                  description: node.frontmatter.description,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  html: node.html,
                }
              })
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `grant-glidewell-blog`,
        short_name: `blog`,
        start_url: `/`,
        background_color: `#efefef`,
        theme_color: `#efefef`,
        display: `minimal-ui`,
        icon: `src/images/ggblog.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-vscode`,
            // All options are optional. Defaults shown here.
            options: {
              colorTheme: 'Dark+ (default dark)', // Read on for list of included themes. Also accepts object and function forms.
              injectStyles: true, // Injects (minimal) additional CSS for layout and scrolling
            },
          },
        ],
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
