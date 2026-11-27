# Creating a dashboard

Follow these instructions when someone wants to create or change a map dashboard with `@geodienst/dashkit`. Assume they have no programming knowledge.

While you follow them, they replace the developer rules of this repository (e.g. test-driven development, the user runs the tests): the person you work with is not a developer.

All files these instructions mention are in the dashkit repository on GitHub. Read them online, at `https://raw.githubusercontent.com/geodienst/dashkit/v<version>/<path>`. Don't download the repository.

`<version>` is the package version the dashboard uses:

- new dashboard: the latest one (`npm view @geodienst/dashkit version`)
- existing dashboard: the installed one (`version` in `node_modules/@geodienst/dashkit/package.json`)

Before you start, check that Git and Node 26 are installed. If one is missing, install it, or guide the person through installing it, in plain words.

## 1. Talk plainly

- The person can't program. Don't show code and don't use technical terms.
- Ask one question at a time.
- Show results in the browser instead of explaining code.

## 2. Get the data

The goal is to show a first draft as early as possible. So ask only what that draft needs, one after another:

- the purpose of the dashboard and who will use it
- the title
- the data: where it is (e.g. a Google Sheet or a CSV file). Ask for a sample and check that it is usable:
  - one row per item
  - a name, a longitude and a latitude per row
  - a Google Sheet must be shared as "Anyone with the link can view"

Everything else (filters, lists, icons, texts, languages, look) comes later, step by step.

## 3. Show a first draft

As soon as the data is usable, build a page with only the title and a map that shows one marker per item (see "How to build" below). Start it and let the person look at it in the browser. When they like it, save it as described in step 4.

## 4. Build together, step by step

Ask the person what should come next. If they don't know, suggest a few things in plain words, e.g. a filter, a list, a table, icons per category, a legend, a text like an FAQ, other languages, a logo or colors.

For each wish:

1. Check it against the catalogue (see step 5).
2. Say in one or two sentences what you will build: what is where, what happens on a click. Build only after the person says yes.
3. Build it, start the dashboard (`npm start`) and let the person look at it in the browser.
4. Run the tests (`npm test`) yourself: the person can't judge test results.
5. Ask whether they like what they see. If yes, save the step: commit everything with a short message in plain words that says what the step added, e.g. "Filter by category". Then ask what should come next.

Repeat until the person says the dashboard is done.

### Going back

If the person wants to go back, e.g. after a mistake or because they don't like a change:

1. Read the Git history and show it as a numbered list of the saved steps in plain words, newest first, with date and time.
2. Ask to which step the dashboard should go back. Changes that aren't saved yet are lost; say so.
3. Discard the changes that aren't saved yet, go back with `git revert --no-commit <chosen step>..HEAD` and commit with a message like "Back to: Filter by category". So the history keeps everything, and the person can later also go back to a step after the chosen one.
4. Start the dashboard and let the person look at it.

## 5. Check every wish against the catalogue

`docs/create-dashboard/components.md` lists everything that is possible. What isn't in it isn't possible yet.

- **Possible:** note which component does it.
- **Not possible:** say clearly that it isn't possible yet. Explain that a developer could extend the library, but that this is more work. Propose the closest alternative that works now, and let the person choose.
- For each wish that can't be fulfilled, advise the person to open an issue at <https://github.com/geodienst/dashkit/issues/new>, so the developers learn about it. Write the issue for them: a short title and a plain text saying what they want and why. Let them choose:
  - **now:** give them the title and text to paste into the issue.
  - **later:** collect the wish in `WISHES.md` in the dashboard folder, and remind them of the open wishes at the hand-over.
  - **not at all:** drop the wish and don't bring it up again.

## 6. How to build

- Create the dashboard as a new Angular app in the folder the person opened. It must be a Git repository (`ng new` creates one, if Git is installed). Use the Angular version the library requires (see `peerDependencies` in `projects/geodienst/dashkit/package.json`).
- Install exactly that version from npm (`npm install @geodienst/dashkit@<version>`) and set it up as described in the package README (`projects/geodienst/dashkit/README.md`).
- To learn how a component is used, read its files: for `gd-<name>`, `projects/geodienst/dashkit/src/lib/<name>/<name>.ts` lists its inputs and outputs, and `<name>.spec.ts` next to it shows it in use.
- The dashboard loads its data itself. A Google Sheet shared as "Anyone with the link can view" is available as CSV at `https://docs.google.com/spreadsheets/d/<sheet id>/gviz/tq?tqx=out:csv`.
- Never change the library.

## 7. Hand over

Write in the new dashboard folder:

- `AGENTS.md` (read by most AI tools) and `CLAUDE.md` (read by Claude Code), each with only this line, so that an AI session started later in the dashboard folder finds these instructions again:

  ```markdown
  To change this dashboard, read and follow https://raw.githubusercontent.com/geodienst/dashkit/master/docs/create-dashboard/INSTRUCTIONS.md
  ```

- a `README.md` in plain words: how to start the dashboard and how to update its data.

If `WISHES.md` still contains wishes, remind the person to open an issue for each, as in step 3.

Putting the dashboard online isn't covered by these instructions. If the person asks, say so and suggest asking the developers.
