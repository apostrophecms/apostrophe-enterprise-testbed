const _ = require('lodash');

function run(config, ready) {
  const address = process.env.ADDRESS || 'localhost';
  const port = process.env.PORT || '3000';

  const baseUrl = `http://${address}:${port}`;
  console.log('APP', address, port, baseUrl);

  let locales = [
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
  ];
  if (process.env.MANY_LOCALES) {
    locales = [
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
      },
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
    ];
  }

  if (process.env.WORLD_LOCALES_HALF) {
    locales = worldLocales({ half: true });
  }

  if (process.env.WORLD_LOCALES) {
    locales = worldLocales({});
  }

  const apos = require('apostrophe')(
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
          alias: 'products'
        },
        'products-pages': {
          extend: 'apostrophe-pieces-pages'
        },
        'products-widgets': {
          extend: 'apostrophe-pieces-widgets'
        },
        'apostrophe-blog': {
          alias: 'blog'
        },
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
            },
            {
              label: 'Workflow',
              items: [ 'apostrophe-workflow-locale-picker-modal', 'apostrophe-workflow-manage-modal' ]
            }
          ]
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
          locales: [
            {
              name: 'master',
              label: 'Master',
              private: true,
              children: locales
            }
          ],
          defaultLocale: 'en',
          prefixes: computePrefixes(locales)
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
        },

        'content-generator': {}
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

function worldLocales(options) {
  let all = require('./lib/worldLocales.js');
  if (options.half) {
    all = all.filter((locale, index) => index & 1);
  }
  const locales = [];
  const localesByName = {};
  const seen = {};
  // At least one duplicate in the source data
  all = all.filter(locale => {
    if (seen[locale.ABBREV]) {
      return false;
    }
    seen[locale.ABBREV] = true;
    return true;
  });
  all.forEach(locale => {
    locale = {
      name: locale.ABBREV,
      label: locale.Country,
      children: []
    };
    if (locale.name.match(/-.*-/)) {
      // Three part locale names aren't good for this simple test
      // and there are just three of them, they won't affect
      // this test's realism as a measure of performance with
      // many locales
      return;
    }
    const matches = locale.name.match(/^([a-z]+)-([a-z])+$/);
    if (!matches) {
      localesByName[locale.name] = locale;
      locales.push(locale);
    } else {
      if (!localesByName[matches[1]]) {
        const labelMatches = locale.label.split(/ - /);
        const parent = {
          name: matches[1],
          label: labelMatches[0],
          children: []
        };
        locales.push(parent);
        localesByName[matches[1]] = parent;
      }
      localesByName[matches[1]].children.push(locale);
    }
  });
  return locales;
}

function computePrefixes(locales) {
  const result = {};
  recurse(locales);
  return result;
  function recurse(locales) {
    locales.forEach(locale => {
      result[locale.name] = '/' + locale.name;
      if (locale.children) {
        recurse(locale.children);
      }
    });
  }
}

