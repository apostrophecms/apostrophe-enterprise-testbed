const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    after: (client, done) => {
      client.end(() => {
        this._server.stop(done);
      });
    },
  },
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  steps.addTextWidgetTo({selector: '.demo-pageheader', text: 'Home Page Rich Text!'}),
  steps.submitChanges(),
  {
    'Copy Home Page': client => {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageMenuDropdownSelector = '.apos-context-menu .apos-dropdown-items';
      const pageMenuCopyPageSelector = '.apos-context-menu .apos-dropdown-items [data-apos-copy-page]';

      client.clickWhenReady(pageMenuBtnSelector);
      client.waitForElementReady(pageMenuDropdownSelector);
      client.clickWhenReady(pageMenuCopyPageSelector);
      client.resetValueInModal('apostrophe-pages-editor-copy', '[name="title"]', 'Home Page Copy');
      client.clickInModal('apostrophe-pages-editor-copy', '[data-apos-save]');
    }
  },
  steps.submitChanges(),
  steps.checkSubmitted(['Home Page Copy']),
  {
    'confirm home-page-copy page url': client => {
      const homePageRichText = '.demo-pageheader [data-rich-text]';
      client.assert.urlEquals('http://localhost:3111/en/home-page-copy');
      client.expect.element(homePageRichText).text.to.contain('Home Page Rich Text!');
    }
  },
  steps.navigateToHome(),
  steps.makeSubPage('A Page To Be Copied'),
  steps.submitChanges(),
  steps.checkSubmitted(['A Page To Be Copied']),
  {
    'confirm a-page-to-be-copied page url': client => {
      client.assert.urlEquals('http://localhost:3111/en/a-page-to-be-copied');
    }
  },
  steps.addTextWidgetTo({selector: '.demo-main', text: 'A default page that is not the home page!'}),
  steps.commit(),
  {
    'Copy The Default Page': client => {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageMenuDropdownSelector = '.apos-context-menu .apos-dropdown-items';
      const pageMenuCopyPageSelector = '.apos-context-menu .apos-dropdown-items [data-apos-copy-page]';

      client.clickWhenReady(pageMenuBtnSelector);
      client.waitForElementReady(pageMenuDropdownSelector);
      client.clickWhenReady(pageMenuCopyPageSelector);
      client.resetValueInModal('apostrophe-pages-editor-copy', '[name="title"]', 'Default Page Copy');
      client.clickInModal('apostrophe-pages-editor-copy', '[data-apos-save]');
    }
  },
  steps.submitChanges(),
  steps.checkSubmitted(['Default Page Copy']),
  {
    'confirm default-page-copy page url': client => {
      const defaultPageRichText = '.demo-main [data-rich-text]';
      client.assert.urlEquals('http://localhost:3111/en/default-page-copy');
      client.expect.element(defaultPageRichText).text.to.contain('A default page that is not the home page!');
    }
  }
);
