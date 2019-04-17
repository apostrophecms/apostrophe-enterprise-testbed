var _ = require('lodash');
var locales;
var prefixes;

if (process.env.EXTRA_LOCALES) {
  prefixes = {
    fr: '/fr',
    en: '/en',
    es: '/es',
    be: '/be',
    de: '/de',
    au: '/au',
    nl: '/nl',
    ru: '/ru',
    hu: '/hu',
    th: '/th'
  };
} else {
  prefixes = {
    fr: '/fr',
    en: '/en',
    es: '/es',
  }
}

function run(config, ready) {
  var address = process.env.ADDRESS || 'localhost';
  var port = process.env.PORT || '3000';

  const baseUrl = `http://${address}:${port}`;
  console.log('APP', address, port, baseUrl);

  var apos = require('apostrophe')(
    _.assign({
      shortName: 'apostrophe-enterprise-testbed',
      baseUrl: baseUrl,
      root: module,

      // These are the modules we want to bring into the project.
      modules: {
        'apostrophe-site-map': {
          // array of doc types you do NOT want
          // to include, even though they are
          // accessible on the site. You can also
          // do this at the command line
          excludeTypes: [],
          perLocale: true
        },
        'apostrophe-templates': { viewsFolderFallback: __dirname + '/views' },
        'apostrophe-express': {
          session: {
            secret: 'ksajhfkdsfha43fahif3a8asdfkyfsd7f',
            cookie: {
              // domain: 'workflow.com'
            }
          }
        },

        // Standard Apostrophe Modules
        'apostrophe-assets': {
          jQuery: 3
        },
        'products' : {
          extend: 'apostrophe-pieces',
          name: 'product',
          label: 'Product',
        },
        'products-pages': {
          extend: 'apostrophe-pieces-pages'
        },
        'apostrophe-blog': {},
        'apostrophe-blog-pages': {},
        'apostrophe-blog-widgets': {
          extend: 'apostrophe-pieces-widgets'
        },
        'apostrophe-blog-widgets': {},
        'apostrophe-users': {},

        'apostrophe-admin-bar': {
          groups: [
            {
              label: 'Media',
              items: [ 'apostrophe-images', 'apostrophe-files' ]
            }
          ].concat(process.env.WORKFLOW_ONLY ? [
            {
              label: 'Workflow',
              items: [ 'apostrophe-workflow-manage-modal', 'apostrophe-workflow-modified-documents' ]
            }
          ] : [
            {
              label: 'Workflow',
              items: [ 'apostrophe-workflow-locale-picker-modal', 'apostrophe-workflow-manage-modal', 'apostrophe-workflow-modified-documents' ]
            }
          ])
        },

        // Apostrophe Sandbox (as-) specific modules
        'as-helpers': {},
        'as-two-column-block-widgets': {},

        'mixed-widgets': {
          extend: 'apostrophe-widgets',
          label: 'Mixed',
          addFields: [
            {
              name: '_items',
              type: 'joinByArray',
              withType: [ 'apostrophe-blog', 'product', 'apostrophe-page' ]
            }
          ]
        },
        'pages-widgets': {
          extend: 'apostrophe-widgets',
          label: 'Pages',
          addFields: [
            {
              name: '_items',
              type: 'joinByArray',
              withType: 'apostrophe-page'
            }
          ]
        },

        'apostrophe-workflow': {
          alias: 'workflow',
          locales: process.env.WORKFLOW_ONLY ? null : [
            {
              name: 'master',
              label: 'Master',
              private: true,
              children: [
                {
                  name: 'en',
                  label: 'en',
                },
                {
                  name: 'fr',
                  label: 'fr'
                },
                {
                  name: 'es',
                  label: 'es'
                }
              ].concat(process.env.EXTRA_LOCALES ? [
                {
                  name: 'be',
                  label: 'Belgium'
                },
                {
                  name: 'de',
                  label: 'Germany'
                },
                {
                  name: 'au',
                  label: 'Australia'
                },
                {
                  name: 'nl',
                  label: 'Netherlands'
                },
                {
                  name: 'ru',
                  label: 'Russia'
                },
                {
                  name: 'hu',
                  label: 'Hungary'
                },
                {
                  name: 'th',
                  label: 'Thailand'
                }
              ] : [])
            }
          ],
          defaultLocale: process.env.WORKFLOW_ONLY ? null : 'en',
          prefixes: process.env.WORKFLOW_ONLY ? null : prefixes
        },

        'apostrophe-workflow-modified-documents': {},

        'apostrophe-personas': {
          personas: [
            {
              name: 'robot',
              label: 'Robot',
              prefixes: {
                'en': '/robot',
                'fr': '/robot',
                'es': '/robot'
              }
            }
          ]
        },

        'apostrophe-review-and-deploy': {
          deployTo: [
            {
              name: '3001',
              baseUrl: 'http://localhost:3001',
              prefix: '',
              apikey: 'XYZ'
            },
            {
              name: '3002',
              baseUrl: 'http://localhost:3002',
              prefix: '',
              apikey: 'XYZ'
            }
          ]
        }
      },

      afterListen: function(err) {
        if (err) {
          throw err;
        }
        if (ready) {
          ready();
        }
      }
    }, config)
  );
  return apos;
}

module.exports = run;

if (!global.testing) {
  run();
}
