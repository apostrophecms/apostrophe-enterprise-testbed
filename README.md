# apostrophe-enterprise-testbed

This project is intended as a tested for browser-based functional tests. It is not intended as a sample website.

Dependencies point to the github master branches of modules in order to ensure they all meet the current regression testing expectations before those that have been updated can be published to npm.

## Testing the site

Restore the provided database from the `mongodump` folder:

```
mongorestore --noIndexRestore mongodump/ --drop
```

You (or more likely your automated tests) can now log in at `http://localhost:3000` as username `admin`, password `demo`.

## Tests to perform

*References to an "incognito window" below should be understood as "a distinct browsing context, not able to see cookies etc. seen before in this sequence."*

* Login to the site and switch to the `en` locale.
* Switch to "draft" node.
* Make a new "default" subpage titled "Regression Test" (via the context menu at lower left).
* Add a new "images" (slideshow) widget to that page.
* Upload images, add them to ther slideshow and save. Observe them on the page.
* "Submit" the page.
* Confirm that the UI reflects the Submitted state (button says "Submitted").
* Click Workflow in the admin bar, then Submissions. Verify that the page, as well as the images, appear in the submissions list.
* In an incognito window, in a logged-out state, confirm you get a 404 at the new page's URL.
* In the logged-in window, log back in, go to the page, and commit it. Say "yes" to all invitations to commit and export the document and/or related documents (this is a sequence of modals).
* Verify that among these are the images you uploaded, as well as the page.
* Open an incognito window, and in a non-logged in state, confirm you can see the committed page in the locale you committed it to, with its images.
* View the page in the `fr` locale (change URL prefix to `/fr`) in the incognito browser — should 404 (it is only a draft initially after export).
* View the page in the `fr` locale in the logged-in browser, in draft mode — should be there.
* Commit it in that second locale. Do not export.
* Open an incognito browser, and in a non-logged in state, confirm you can now see the committed page in the `fr` locale.
* Switch to the `es` locale in draft mode.
* Confirm that the page exists in draft mode for `es` and is marked `Submitted` (the button is grayed out and says "Submitted").
* Modify the page in the `es` locale.
* Commit in that locale. Do not export.
* Confirm you can view the content in the incognito window for the `es` locale.
* Back in draft mode, remove a widget from the page for the `es` locale.
* Confirm that the preview of the changes correctly highlights this change as a deletion (X, red).
* Commit those updates to `es`.
* Still in `es`: confirm those updates in the incognito window for that locale.
* Still in `es`: edit something on the `apostrophe-global` doc (add a widget to the area at the bottom of the page, which is a shared global footer).
* Commit the global doc (via the main commit button on the page).
* Export the global doc, make sure there is no crash.
* Verify that the change to the footer is visible for the `en` locale at the bottom of the page when in draft mode.
* Still in `en`: create an article, via the admin bar. Make sure you give it a publication date (today's date is fine). Save the draft.
* Reopen the article. Submit the article, via the "Workflow" menu in the dialog box.
* Reopen the article. Commit the article.
* Ropen the article. Export the article to all other locales.
* Verify the article can be found under "Articles" in draft mode for the `es` locale.
* Edit page type of an existing page (change "default" to "alternate"). Some content may disappear due to changed area names, this is OK.
* Change page type back. All content appears as before.
* View the reorganize modal. Should display the page tree including the regression test page.
* Move a page via reorganize (drag and drop the "regression test" page to "trash").
* Verify the regression test page URL is now a 404.
* Return to the home page. Open reorganize and drag and drop the "regression test" page out of "trash" and drop it on the home page, making it a live child again.
* Verify the page is now reachable at its URL again.
