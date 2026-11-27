# What a dashboard can contain

These are the building blocks of `@geodienst/dashkit`. This list is the only source of truth: what isn't in it isn't possible yet.

## General

- **Items:** a dashboard shows a list of things, e.g. care providers or projects. Every item has a name, a location (longitude and latitude) and an icon.
- **Data:** the components don't load data. The dashboard itself loads it, e.g. from a Google Sheet or a CSV file, and decides which items a filter keeps.
- **Icons:** every icon is a name from [Material Symbols](https://fonts.google.com/icons), e.g. `school` or `local_hospital`. Own pictures can't be used as icons.
- **Look:** colors and fonts come from one theme for the whole dashboard. Single components can't get their own colors.
- **Languages:** the texts of the components themselves (e.g. "Search", "Reset") exist in English, German, French, Spanish, Turkish, Bulgarian and Greek. All other texts (titles, labels, FAQ) are written by the dashboard, in as many of these languages as wanted.
- **Phones:** the map, the legend and the counter adapt to small screens.

## Components

| Component | What you see | What it needs | Options |
| --- | --- | --- | --- |
| `gd-map-view` | A map with one icon per item. The item's name shows when hovering over its icon. Zoom buttons, a scale and a "show my location" button in the top right corner. A legend in the bottom left, a counter ("how many of all items are shown") in the bottom right. A "Reset" button appears once the map was moved or a filter is set; it zooms back to all items and clears the filters. At the start the map zooms to all items. | the items, a basemap (the map style underneath) | which items are shown (e.g. after filtering); what happens when an icon is clicked; extra buttons below the zoom buttons, with icon and text or icon only; a logo next to the counter; the legend texts per icon |
| `gd-legend` | A box that explains the icons: one line per icon with its text. Icons without a text appear under "Other". A click folds it to its title and back. On phones it starts folded. Already part of `gd-map-view`. | the items | the text per icon and their order; only the icons of the shown items, or always all; show the icon name next to the icons under "Other" |
| `gd-count-gauge` | A ring that shows how many of all items are shown. Already part of `gd-map-view`. | the number shown and the total | – |
| `gd-header-bar` | A bar at the top of the page with a title. | the title | a subtitle; a logo, optionally linking to a website; room for other components at its start and end, e.g. a menu or a language switch |
| `gd-menu` | A "⋮" button that opens a menu. | its entries, e.g. "FAQ" or a language switch | – |
| `gd-language-switch` | A button with the current language that opens a list of languages. Choosing one reloads the page in that language. | the languages with their names | as a button, or as an entry inside a menu |
| `gd-markdown-dialog` (`gdMarkdownDialog`) | Turns a button or menu entry into one that opens a window with a formatted text, e.g. FAQ, instructions or a changelog. | the text, written in Markdown (headings, lists, links, bold) | – |
| `gd-info-button` | A "?" help button. Combined with `gdMarkdownDialog` it opens a help text. | – | – |
| `gd-multi-select-filter` | A drop-down field with checkboxes, where several values can be chosen at once. | its label, the values | a display text per value; a "Select all" checkbox |
| `gd-country-filter` | A list of buttons, one per value (e.g. per country), each with its number of items and a bar showing that number compared to the others. Several can be chosen at once. Despite its name it works for any kind of value. | the values with their numbers | a title and subtitle; hide the numbers; sort by name or by number; an extra button with icon next to chosen values, e.g. "zoom to this country" |
| `gd-item-list` | A search field above a list of item names. A click on a name tells the dashboard which item was chosen, e.g. to zoom the map to it. | the items, the text per line | sorted by name or in the original order; the item's icon in front of each line |
| `gd-data-table` | A table with one row per item. The header stays visible while scrolling. | the items, the columns (header and value per item) | a button to download the table as a CSV file (opens in Excel) |
| `gd-tab-panels` | Tabs at the top that switch between parts of the page, e.g. "Map" and "Table". A hidden part keeps its state, e.g. the position of the map. | the parts, each with its tab title | – |
| `gd-image` | A picture, e.g. a logo. | the picture's address | – |
| `gd-marker-icon` | The icon of an item, the same as on the map, e.g. in front of the lines of a list. | the icon name | – |
