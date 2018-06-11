module.exports = {
  park: (process.env.PRODUCTS_PAGE ? [
    {
      title: 'Products',
      type: 'products-page',
      slug: '/products',
      published: true,
      parkedId: 'products'
    }
  ] : []).concat(process.env.ARTICLES_PAGE ? [
    {
      title: 'Articles',
      type: 'apostrophe-blog-page',
      slug: '/articles',
      published: true,
      parkedId: 'articles'
    }
  ] : []),
  types: [
    { name: 'default', label: 'Default Page' },
    { name: 'alternate', label: 'Alternate Page' },
    { name: 'apostrophe-blog-page', label: 'Blog Index' },
    { name: 'home', label: 'Home' }
  ]
}
