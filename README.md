# apostrophe-enterprise-testbed

This project is intended as a testbed for browser-based functional tests. It is not intended as a sample website.

Dependencies point to the github master branches of modules in order to ensure they all meet the current regression testing expectations before those that have been updated can be published to npm.

## end-to-end testing

```
npm install
npm test
```

This will do complete test runs: one with the default / legacy replication of all docs across all locales, and one with `replicateAcrossLocales` set to `false`. Both must pass as we have clients with both configurations.

## Test development

`apostrophe-nightwatch-tools` is used. See the `tests/scenarios` folder.

To run the tests for a single scenario in the browser, use:

```
TEST=scenarioname VISIBLE=1 npm run e2e-local
```

To run them in a headless browser, so you don't have to watch, use:

```
TEST=scenarioname npm run e2e-local
```

To run all of the scenarios, use:

```
npm run e2e-local
```

Note: `npm test` will run the entire suite twice, with and without disabling sessions for anonymous users, and the set of flags like that it tests is expected to grow.

## Visual diff

You can also run:

```
npm run test-with-visual-diff
```

To carry out full runs on both the latest npm release and the latest git master, resulting in a [visual diff report](https://s3.amazonaws.com/apostrophe-enterprise-testbed/index.html). **Currently not set up to test both with and without replication**. Our primary test for new releases is `npm test`.

## Testing the site

Restore the provided test database:

`npm run restore`

Then start the site:

`node app`

You (or your automated tests) can now log in at `http://localhost:3000` as username `admin`, password `demo`.

## Tests performed

*References to an "incognito window" below should be understood as "a distinct browsing context, not able to see cookies etc. seen before in this sequence."*

* Login to the site. Verify you are in the `en` locale (see locale menu, lower left).
* Switch to "draft" node (menu next to locale menu).
* Make a new "default" subpage titled "Regression Test" (via the context menu at lower left). Save Draft.
* Add a new "images" (slideshow) widget to that page. You may do so with the middle content area's "+" button, centered here: <img src="https://www.dropbox.com/s/y1yfwvqc004bsmk/4nrzs2u0.png?raw=1" />
* Upload images, add them to the slideshow and save (you may select multiple files for a single upload). Observe the images are present on the page.
* "Submit" the page.
* Confirm that the UI reflects the Submitted state (button says "Submitted").
* Click Workflow in the admin bar, then Submissions. Verify that the page, as well as the images, appear in the submissions list.
* In an incognito window, in a logged-out state, confirm you get a 404 at the new page's URL.
* In the logged-in window, "Commit" the page. Say "yes" to all invitations to commit and export the document and/or related documents (this is a sequence of modals). Select all locales for export (click "Master" to select all child locales).
* Verify that among these are the images you uploaded, as well as the page.
* Open an incognito window, and in a non-logged in state, confirm you can see the committed page in the locale you committed it to, with its images.
* View the page in the `fr` locale (change URL prefix to `/fr`) in the incognito browser — should 404 (it is only a draft initially after export).
* View the page in the `fr` locale in the logged-in browser, in draft mode — should be there.
* Commit it and its dependencies in that second locale. Do not export.
* Open an incognito browser, and in a non-logged in state, confirm you can now see the committed page in the `fr` locale.
* Switch to the `es` locale in draft mode.
* Confirm that the page exists in draft mode for `es` and is marked `Submitted` (the button is grayed out and says "Submitted").
* Modify the page in the `es` locale, by adding a new widget, a rich text widget above the slideshow. (KNOWN ISSUE: the "add content" dropdown will fight with the button bar for the existing widget. Click on the far right side of the "add rich text" item where it is not obscured by the dropdown. Probably won't come up with Nightwatch.)
* Commit in that locale. Do not export.
* Confirm you can view the content in the incognito window for the `es` locale.
* Back in draft mode, remove a widget from the page for the `es` locale.
* Within a few seconds the "Submit" and "Commit" buttons should be available.
* Click "Commit."
* Confirm that the preview of the changes correctly highlights this change as a deletion (X, red).
* Commit those updates to `es`. Do not export.
* Still in `es`: confirm those updates in the incognito window for that locale.
* Still in `es`: edit something on the `apostrophe-global` doc (add a widget to the area at the bottom of the page, which is a shared global footer).
* Commit the global doc (via the main commit button on the page).
* Export the global doc.
* Verify that the change to the footer is visible for the `en` locale at the bottom of the page when in draft mode.
* Still in `en`: create an article, via the admin bar. Make sure you give it a publication date (today's date is fine). Also set "Published" to "Yes." Save the draft.
* Reopen the article. Submit the article, via the "Workflow" menu in the dialog box.
* Reopen the article. Commit the article. (The preview area says "no preview available," this is OK.)
* Ropen the article. Export the article to all other locales.
* Verify the article can be found under "Articles" in draft mode for the `es` locale.
* Still in `es`: add a blog widget to the regression test page. Pick "individually" and select the article.
* Commit and export.
* Verify that the blog widget also shows the article in the `fr` locale, in draft mode.
* Return to "en" locale. Edit page type of your regression test page (change "default" to "alternate"). Verify that the page now says:

```
You are on the "Alternate Page" template
```

And that the slideshow is still present.

* Change page type back. All content appears as before.
* View the reorganize modal (Page Menu -> Reorganize). Should display the page tree including the regression test page.
* Move a page via reorganize (drag and drop the "regression test" page to "trash").
* In the logged-in browser, verify the regression test page URL is now a 404 (the incognito browser will still see it because the move to the trash has not been committed).
* In the logged-in browser, return to the home page. Open reorganize and drag and drop the "regression test" page out of "trash" and drop it on the home page, making it a live child again.
* In the logged-in browser, verify the page is now reachable at its URL again.

## Configuration test: adding new locales

*These tests currently require a developer, they could and should be automated too.*

* Restart the site, this time with `EXTRA_LOCALES=1 node app`. Wait for it to listen on the port.
* Verify that the regression test page you created now exists in the `ru` locale, and is not in the trash, because it was copied from `default`, the parent locale, among the many you exported this page to.
* The joined content (images and article) will appear, as it was also copied from `default`, the parent locale.
