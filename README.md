# Gallery

Simple gallery website for promoting an artist.

It takes a google spreadsheet describing artworks and deploys a 100% front application to display them.

## Configuration

You'll need [Bun](https://bun.sh/) installed.

```shell
$ bun install
```

### Builder configuration

Copy `config.sample.json` to `config.json``

Edit `config.json` :

-   apiKey : google API key for accessing sheets API
    -   in [google could console](https://console.cloud.google.com/)
        -   create a new project ('gallery' for instance)
        -   enable _Google Sheets API_ for this project
        -   create an API key for the project
            -   scope it to _Google Sheets API_

### Sites configuration

One file per site in `sites/`, mamed `(yourSiteId).json`

copy `sites/rp.json` to `(yourSiteId).json` and customize.

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

### Spreadsheets conventions

Speadsheets providing sites data are google spreadsheets.

The gallery data is always in the first sheet.

There must be one and online column of type `publish`.

There must be one and online column of type `id` (unique reference of the artworks).

There must be one and online column of type `visual`.

### Scripts

#### feed

This is the first step before building.

Converts the google spreadsheet data to a json database file.

```shell
$ bun feed <siteId>
```

The `artworks.json` file is created in `public/assets`

#### dev

Runs the dev server, skip if you don't want to modify the code.

```shell
$ bun dev
```

#### build

Prepares the gallery for deployment.
Populates the `dist` directory with bundled source and assets.

```shell
$ bun run build
```

#### preview

After a _build_, to test the bundled site locally.

```shell
$ bun preview
```

#### deploy

TODO

```shell
$ bun deploy
```

#### update

TODO

Chaining _feed_, _build_ and _deploy_ : the one-liner to go from modification of the google spreadsheet to production site.
