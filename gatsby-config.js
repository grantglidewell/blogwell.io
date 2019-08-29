module.exports = {
  siteMetadata: {
    title: `Grant Glidewell | Blog`,
    description: `Grant Glidewell is a JavaScript engineer living in San Diego, CA. He loves science fiction, dogs, and coffee.`,
    author: `@grantglidewell`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
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
