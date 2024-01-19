# Agility's Netlify Connect Integration

Access all your Agility content through Netlify Connect.

## Config Values

- guid: the GUID of your instance.
- apiKey: The fetch or preview API token from your Agility instance.
- isPreview: Determines if you are viewing preview content. Match with the preview API key
- locales: comma separated list of the locale codes in your instance that you want to pull content for.
- sitemaps: comma separated list of sitemap reference names that you want to pull layouts (pages) for.

## Content Types

This connector makes all of your Content, Sitemaps, Layouts, Components and URL Redirections available.

Each GraphQL type is prefixed by **Agility**

### Locales

- You will be able to query each kind of content based on its locale in your query if you have multiple locales.

### Linked Content

- Linked content that is rendered as a Dropdown, Checkbox List, and Search List Box are automatically expandable within the graphQL query.
- Linked content that is a "full list" link - such as those that are rendered with a Grid or a Link, return the referenceName of that content. You will need to do a second query to return that list.

### Example Queries

#### Content List

This following query shows a query to the `Post` Content Model, filtered by the `posts` content reference name.

It also shows querying the 'title`from the`category` linked content dropdown field.

```
allAgilityPost (filter: {properties: {referenceName: {eq: "posts"}}})
  {
    nodes {
      contentId
      properties {
        agilityVersionId
        locale
      }
      category {
        title
      }
      title
    }
  }
```

#### Flat Sitemap

Gets the nodes from the flat sitemap (used for routing), filtered by `referenceName`, `locale`.

```
agilitySitemapFlat (referenceName: {eq: "website"}, locale:{eq:"en-us"}) {
    referenceName
    locale
    nodes
  }
```
