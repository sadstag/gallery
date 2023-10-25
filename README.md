# Gallery

Simple gallery website for promoting an artist.

## Configuration

You'll need [Bun](https://bun.sh/) installed.

```shell
$ bun install
```

### Builder configuration

Copy _config.sample.json_ to _config.json_.

Edit config.json :

-   apiKey : google API key for accessing sheets API
    -   in [google could console](https://console.cloud.google.com/)
        -   create a new project ('gallery' for instance)
        -   enable _Google Sheets API_ for this project
        -   create an API key for the project
            -   scope it to _Google Sheets API_

### Spreadsheets conventions

Speadsheets providing sites data are google spreadsheets.

The gallery data is always in the first sheet.

There must be one and online column of type `publish`.

There must be one and online column of type `id` (unique reference of the artworks).

### Sites configuration

One file per site in _sites/_.

Named _(siteId).json_

copy _sites/exmaple.json_ to _(yourSiteId).json_ and customize.

#### types of columns

##### publish

The be must one and only one column of type `publish` in the data sheet.

Intended values are `TRUE` and `FALSE` (use a checkbox in the cell in google sheet will work).

In practive `TRUE` means "publish this artwork on the site", and every other value means `FALSE`.

##### id

In a column of type `id` a cell give the unique reference of an artwork, it may be a number, or a more general string.

##### text

Just some text

##### number

##### enum

Whose values are amongst a (small) set of possible values.
In a filter selector, it will probably end-up looking like a simple select or a radio group.

The set of possible values is taken from the analysis of the spreadsheet.

##### tags

A set of values amongst a (possibly) large set of possible values, filter will probably look like a multi-selection list.

The set of possible values is taken from the analysis of the spreadsheet.

### Scripts

#### feed

Will convert the google spreadsheet data to an embeddable json.

```shell
$ bun run feed <siteId>
```
