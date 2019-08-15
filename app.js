var _ = require('@sailshq/lodash');
var locales;
var prefixes;
var hostnames;

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
    es: '/es'
  };
}

if (process.env.HOSTNAMES) {
  hostnames = {};
  Object.keys(prefixes).forEach(function(locale) {
    hostnames[locale] = locale + '.localhost';
  });
  prefixes = {};
}

function run(config, ready) {
  var address = process.env.ADDRESS || 'localhost';
  var port = process.env.PORT || '3000';

  const baseUrl = `http://${address}:${port}`;
  console.log('APP', address, port, baseUrl);

  let modules =  {
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
      },
      csrf: {
        // Do not generate sessions just for CSRF's sake, reserve truly random
        // CSRF tokens for logged-in users, use fallback protection based on
        // Same Origin Policy for everyone else
        disableAnonSession: !!process.env.DISABLE_ANON_SESSION
      }
    },

    // Standard Apostrophe Modules
    'apostrophe-assets': {
      jQuery: 3
    },
    'products': {
      extend: 'apostrophe-pieces',
      name: 'product',
      label: 'Product'
    },
    'products-widgets': {},
    'products-pages': {
      extend: 'apostrophe-pieces-pages'
    },
    'apostrophe-blog': {},
    'apostrophe-blog-pages': {},
    'apostrophe-blog-widgets': {
      extend: 'apostrophe-pieces-widgets'
    },
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
      replicateAcrossLocales: process.env.NO_REPLICATE ? false : undefined,
      locales: process.env.WORKFLOW_ONLY ? null : [
        {
          name: 'master',
          label: 'Master',
          private: true,
          children: [
            {
              name: 'en',
              label: 'en'
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
      prefixes: process.env.WORKFLOW_ONLY ? null : prefixes,
      hostnames: process.env.WORKFLOW_ONLY ? null : hostnames
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
        },
        {
          name: 'human',
          label: 'Human',
          prefixes: {
            'en': '/human',
            'fr': '/humain',
            'es': '/humano'
          }
        }
      ]
    },

    'apostrophe-docs': {
      conflictResolution: false
    },

    'apostrophe-forms': {},
    'apostrophe-forms-widgets': {},
    // Form field widgets
    'apostrophe-forms-text-field-widgets': {},
    'apostrophe-forms-textarea-field-widgets': {},
    'apostrophe-forms-select-field-widgets': {},
    'apostrophe-forms-radio-field-widgets': {},
    'apostrophe-forms-checkboxes-field-widgets': {},
    'apostrophe-forms-file-field-widgets': {},
    'apostrophe-forms-boolean-field-widgets': {},
    'apostrophe-forms-conditional-widgets': {},

    'apostrophe-permissions': {
      construct: function (self, options) {
        // Needed if you want file fields to work on public pages
        self.addPublic(['edit-attachment']);
      }
    }

    // 'apostrophe-review-and-deploy': {
    //   deployTo: [
    //     {
    //       name: '3001',
    //       baseUrl: 'http://localhost:3001',
    //       prefix: '',
    //       apikey: 'XYZ'
    //     },
    //     {
    //       name: '3002',
    //       baseUrl: 'http://localhost:3002',
    //       prefix: '',
    //       apikey: 'XYZ'
    //     }
    //   ]
    // }
  };

  if (process.env.SCOPED_PIECES) {
    // Only intended for use by tests/scenarios/scoped-pieces.spec.js,
    // which copies a temporary folder for this purpose into node_modules
    modules['@scoped/pieces'] = {};
  }

  const apos = require('apostrophe')(
    _.assign({
      shortName: 'apostrophe-enterprise-testbed',
      baseUrl: baseUrl,
      root: module,
      modules: modules,

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
