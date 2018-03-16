var _ = require('lodash');

function run(config, ready) {
  var apos = require('apostrophe')(
    _.assign({
      shortName: 'apostrophe-enterprise-testbed',
      baseUrl: 'http://localhost:3000',
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
        'apostrophe-blog': {},
        'apostrophe-blog-pages': {},
        'apostrophe-blog-widgets': {},
        'apostrophe-users': {},

        // Apostrophe Sandbox (as-) specific modules
        'as-helpers': {},
        'as-two-column-block-widgets': {},
        
        'apostrophe-workflow': {
          alias: 'workflow',
          locales: [
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
              ]
            },
          ],
          defaultLocale: 'en',
          prefixes: {
            fr: '/fr',
            en: '/en',
            es: '/es'
          }
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
