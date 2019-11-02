---
title: 'Open Sourcing TAGs Gatsby Front End'

description: 'Third and Grove open sourced a very fast Gatsby front end'

date: '2019-10-17'

author: 'Grant Glidewell'

image: ''
---

![Motorcycle going fast by Harley-Davidson](https://images.unsplash.com/photo-1558980664-769d59546b3d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80)

We believe in open source technologies — this is why we contribute to Drupal, Gatsby, and anything else we touch where we believe we can be helpful. In that same vein, we feel open sourcing our site will give the community some insight into our decisions and allow us to make improvements we were unable to see on our own. We think that software that has been vetted openly is stronger for it.

If you haven’t seen yet, [we just built a Gatsby front end](https://www.thirdandgrove.com/building-new-site-with-drupal-and-gatsby/) that scores a perfect lighthouse score without compromising on features. Our secret? React and Gatsby allowed us to have both creative freedom and technical control.

To help others get past the [pitfalls we ran into](https://www.thirdandgrove.com/insights/achieving-flawless-performance-with-our-new-site/), we are opening this [repository](https://github.com/thirdandgrove/thirdandgrove-com-gatsby) to the world — we hope you find it useful.

#### What you'll find in the repo

While you won’t be able to run this repo locally (without a Drupal instance that exactly matches our data models), you can gain some insights from certain locations. Our styling is handled entirely in JavaScript using emotion. Some of the components we use across the site are just styled components from emotion. We have a component that allows Drupal content editors to maintain some freedom in their workflow. We have some interesting queries that are worth taking a look at as well.

#### Styling with emotion

Emotion is a css-in-js library that allows for a really neat developer experience. Globally we are implementing emotion’s `Global` component in our layout, this has worked well for us. For some container definitions, we have created some common references in the form of objects in `src/styles/custom-css.js`. This was handy as we can use them in a similar way to any other JS utility function. If you’re familiar with template literals then using css-in-js is really straight forward.

```


```

const containerStyles = css`width: ${contValues.min}; max-width: 100%; margin: 0 auto 60px; padding: ${isSmall ? '0 10px' : '0 20px'}; ${mediaQueries.phoneLarge} { ${isSmall &&`margin: 0 0 130px;
padding: 13px 8px 0;
`}; }`;

```


```

In this instance, we are using our container width along with a boolean value from the content. We also use another utility object that generates mediaqueries. Emotion also allowed us to create entire components without having to actually write a component.

```


```

import styled from '@emotion/styled';

import { weights, mediaQueries } from '../../styles';

export default styled.section`
width: ${props => props.width || '100%'};
 min-height: ${props => props.minHeight || '300px'};
display: flex;
flex-direction: ${props => props.flexDirection || 'column'};
 align-items: ${props => props.align || 'center'};
justify-content: \${props => props.justify || 'center'};

${mediaQueries.phoneLarge} {
   min-height: ${props => props.height || '700px'};
}
`;

```


```

Here we have a highly customizable `section` component with sane defaults. Overall, the power of emotion for us was the ability to consolidate our views into single concerns. The whole component is in one file that allows for easier debugging. If you have concerns, about separation of concerns, I feel we are on solid ground with the likes of [Khan Academy](https://medium.com/@jdan/rendering-khan-academys-learn-menu-wherever-i-please-4b58d4a9432d#---0-126.mmbhsjo0j) and [Kent C. Dodds](https://twitter.com/kentcdodds/status/736021795178840064).

#### ContentBody component

You may notice our blog posts (insights) and case studies pass their content into a component called `ContentBody`. The content that comes from Drupal is an array of objects that represent blocks of content. This content can be edited in a highly customizable experience and dependably rendered into React components. Organizing content this way eliminates the need to do markup parsing, replacing images in that markup with the gatsby-image component, and using ‘dangerouslySetInnerHTML’ as some have used to solve the problem of giving content editors the use of a WYSIWYG. There is a balance we have tried to strike here, and it isn't an easy one to find. This is an approach we plan to continue to refine. We think that allowing for blocks of structured content to be rendered provides both freedom and a consistent look and feel to our content.

```


```

const ContentBody = ({ comps, type }) => {
return (
<>
{comps.map(comp => {
// Dynamically select a component based on field name
const componentName = comp.relationships.component_type.name
const Component = Components[componentName];
return (
<Component
data={{ ...comp }}
key={comp.id}
/>
);
})}
</>
);
};

```


```

We supply content editors with Text, Image, Split (image with text), and Quote components. You can see the `ContentBody` component maps the data into corresponding components. While this might not pass a [GREP test](http://jamie-wong.com/2013/07/12/grep-test/), we think it’s a good solution to the problem of content editing freedom vs structured data in Drupal.

#### Graphql queries and data plumbing

The core of Gatsby’s data ingestion pipeline is GraphQL. Having a uniform way to query data is a really nice way to work. Starting with our `gatsby-node.js` file you can see our query that is responsible for generating a lot of our site programmatically. This query’s result is destructured and passed into the proper template or in some cases we create redirects. Something we would like to do in the future is to organize our fragments using something along the lines of the [Relay query container](https://relay.dev/docs/en/classic/classic-guides-containers) pattern.

Hopefully being able to browse the repo and see how we built our site can give you some ideas on what you would like to do in your own work. Gatsby is an emerging part of the JS ecosystem that brings so much value to open source. If you find any issues or have questions don’t hesitate to reach out or file an issue in the repository directly.
