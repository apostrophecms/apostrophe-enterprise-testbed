const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  construct: function(self, options) {

    // Generate a significant volume of pages and pieces

    self.addTask('generate', 'Generate a significant volume of pages and pieces', (apos, argv) => {
      const req = self.apos.tasks.getReq({ locale: 'master-draft' });
      let home = null;
      let tabs = [];
      return Promise.try(function() {
        return self.apos.pages.find(req, { level: 0 }).toObject();
      }).then(function(_home) {
        home = _home;
        return generateProducts();
      }).then(function() {
        return generateArticles();
      }).then(function() {
        return addProductWidgetsToArticles();
      }).then(function() {
        return generateTabs();
      }).then(function() {
        return generateSubpages();
      });

      function generateProducts() {
        console.log('gp');
        return self.apos.tasks.invoke('products:generate', { total: 100, 'workflow-locale': 'master-draft' });
      }
  
      function generateArticles() {
        return self.apos.tasks.invoke('apostrophe-blog:generate', { total: 100, 'workflow-locale': 'master-draft' });
      }

      function addProductWidgetsToArticles() {
        let products = null;
        return Promise.try(() => {
          console.log('finding products');
          return self.apos.modules['products'].find(req).log(true).toArray()
        }).then(_products => {
          console.log('found products: ', _products.length);
          products = _products;
        }).then(() => {
          return self.apos.modules['apostrophe-blog'].find(req).toArray()
        }).then(articles => {
          console.log('found articles: ', articles.length);
          return Promise.mapSeries(articles, article => {
            article.main = {
              type: 'area',
              items: [
                {
                  type: 'products',
                  by: 'id',
                  _id: self.apos.utils.generateId(),
                  pieceIds: _.map(_.sample(products, 5), '_id')
                }
              ]
            };
            return self.apos.modules['apostrophe-blog'].update(req, article);
          });
        });
      }
  
      function generateTabs() {
        return Promise.mapSeries(_.range(0, 8), i => {
          const page = {
            title: 'Tab ' + (i + 1),
            slug: '/tab-' + (i + 1),
            published: true,
            type: 'default'
          };
          tabs.push(page);
          return apos.pages.insert(apos.tasks.getReq(), home, page);
        });
      }

      function generateSubpages() {
        return Promise.mapSeries(_.range(0, 8), i => {
          return Promise.mapSeries(_.range(0, 8), j => {
            const page = {
              title: 'Child ' + (i + 1) + '-' + (j + 1),
              slug: '/page-' + (i + 1) + '-' + (j + 1),
              published: true,
              type: 'default'
            };
            return apos.pages.insert(apos.tasks.getReq(), tabs[i], page);
          });
        });
      }

    });



  }
};
