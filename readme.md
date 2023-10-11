# Agility's Netlify Connect Integration

Access all your Agility content through Netlify Connect.

## Config Values

- guid: the GUID of your instance
- fetchAPIKey: the Fetch API Key for your published / production content
- previewAPIKey: the Preview API Key for your staging content.
- locales: comma separated list of the locale codes in your instance that you want to pull content for
- sitemaps: comma separated list of sitemap reference names that you want to pull layouts (pages) for

## Content Types

This connector makes all of your Content, Sitemaps, Layouts, Components and URL Redirections available.

Each GraphQL type is prefixed by **Agility**

### Locales and Preview Mode

- You will be able to query each kind of content for preview or not.
- You can also include the locale in your query if you have multiple locales.

### Linked Content

- Linked content that is rendered as a Dropdown, Checkbox List, and Search List Box are automatically expandable within the graphQL query.
- Linked content that is a "full list" link - such as those that are rendered with a Grid or a Link, return the referenceName of that content. You will need to do a second query to return that list.

### Example Queries

#### Content List

This following query shows a query to the `Post` Content Model, filtered by the `posts` content reference name, in `preview` mode.

It also shows querying the 'title`from the`category` linked content dropdown field.

```
allAgilityPost (filter: {properties: {preview: {eq: true}, referenceName: {eq: "posts"}}})
  {
    nodes {
      contentId
      properties {
        versionId
        preview
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

Gets the nodes from the flat sitemap (used for routing), filtered by `referenceName`, `locale`, and `preview` mode.

```
agilitySitemapFlat (referenceName: {eq: "website"}, preview: {eq: true}, locale:{eq:"en-us"}) {
    referenceName
    locale
    preview
    nodes
  }
```
