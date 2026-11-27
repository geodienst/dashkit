# Creating a dashboard

Follow these instructions when someone wants to create or change a map dashboard with `@geodienst/dashkit`. Assume they have no programming knowledge.

While you follow them, they replace the developer rules of this repository (e.g. test-driven development, the user runs the tests): the person you work with is not a developer.

## 1. Talk plainly

- The person can't program. Don't show code and don't use technical terms.
- Ask one question at a time.
- Show results in the browser instead of explaining code.

## 2. Ask first, build later

Ask about, one after another:

- the purpose of the dashboard and who will use it
- the data: where it is (e.g. a Google Sheet or a CSV file). Ask for a sample and check that it is usable:
  - one row per item
  - a name, a longitude and a latitude per row
  - something to choose the icon from, e.g. a column with a category
  - a Google Sheet must be shared as "Anyone with the link can view"
- what the map shows, which filters, lists and tables there are
- texts (e.g. an FAQ or instructions), languages, and the look: title, logo, colors

## 3. Check every wish against the catalogue

[`components.md`](components.md) lists everything that is possible. What isn't in it isn't possible yet.

- **Possible:** note which component does it.
- **Not possible:** say clearly that it isn't possible yet. Explain that a developer could extend the library, but that this is more work. Propose the closest alternative that works now, and let the person choose.
- For each wish that can't be fulfilled, advise the person to open an issue at <https://github.com/geodienst/dashkit/issues/new>, so the developers learn about it. Write the issue for them: a short title and a plain text saying what they want and why. Let them choose:
  - **now:** give them the title and text to paste into the issue.
  - **later:** collect the wish in `WISHES.md` in the dashboard folder, and remind them of the open wishes at the hand-over.
  - **not at all:** drop the wish and don't bring it up again.

## 4. Confirm the plan

Summarize the page in plain words: what is where, what can be filtered, what happens on a click. Build only after the person says yes.

## 5. Build

- Create the dashboard as a new Angular app in its own folder next to this repository, e.g. `../my-dashboard`. Use the Angular version the library requires (see its `peerDependencies`).
- Install the package from npm (`npm install @geodienst/dashkit`) and set it up as described in the [package README](../../projects/geodienst/dashkit/README.md).
- To learn how a component is used, read its folder in `projects/geodienst/dashkit/src/lib/`: the `.ts` file lists its inputs and outputs, and the `.spec.ts` shows it in use.
- The dashboard loads its data itself. A Google Sheet shared as "Anyone with the link can view" is available as CSV at `https://docs.google.com/spreadsheets/d/<sheet id>/gviz/tq?tqx=out:csv`.
- Never change the library or anything else in this repository.

## 6. Show and iterate

- Work in small steps. After each step, start the dashboard (`npm start`) and let the person look at it in the browser.
- Run the tests (`npm test`) yourself: the person can't judge test results.
- Ask whether the step is what they wanted before going on.

## 7. Hand over

Write in the new dashboard folder:

- `AGENTS.md` (read by most AI tools) and `CLAUDE.md` (read by Claude Code), each with only this line, so that an AI session started later in the dashboard folder finds these instructions again:

  ```markdown
  To change this dashboard, read and follow `<path>` (in the `@geodienst/dashkit` repository).
  ```

  `<path>` is the relative path from the dashboard folder to this file, as it actually is on this computer.

- a `README.md` in plain words: how to start the dashboard and how to update its data.

If `WISHES.md` still contains wishes, remind the person to open an issue for each, as in step 3.

Putting the dashboard online isn't covered by these instructions. If the person asks, say so and suggest asking the developers.
