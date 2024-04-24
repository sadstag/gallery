# Gallery

Simple gallery website for promoting an artist.

It takes a google spreadsheet describing artworks and deploys a 100% front application to display them.

## Configuration

For each managed site choose a compact name, will will call it *site_id*.

### create the project
- Create a new GCP project for handling a website, ex : 'gallery-[site_id]'

it's probably better that each site has its own GCP project, so create as many project as you have managed site.

- activate 'cloud storage' for each project (don't forget to associate a billing account for could storage on these projects)


### install gcloud CLI
as explained [here](https://cloud.google.com/sdk/docs/install)

then 
```shell
$ gcloud auth login
$ gcloud init # select any project now, the project selection will be made properly by the gallery CLI
$ gcloud auth application-default login
```

### define consent
Defining the consentment manager linked to the application that will operate for the *consumer*.

- go to https://console.cloud.google.com/apis/credentials/consent
- select type 'external' (unless you have workspace account).
- scopes : select none.
- test user : add the *consumer* email here.


### credentials
Getting credentials for the *consumer* so that the scripts can query APIs on its behalf.

- go to https://console.cloud.google.com/apis/credentials
- click on 'create identifiers' > 'OAuth client id'
- applicaton type : 'desktop app'
- name : ex : 'Gallery database builder'
- save json file as `credentials.json` in the root of local copy of gallery

### python environment setup

install pyenv : https://github.com/pyenv/pyenv?tab=readme-ov-file#installation

```shell
$ pyenv install 3.12.2
$ pyenv local 3.12.2
$ pyenv virtualenv 3.12.2 gallery-3.12.2
$ pyenv activate gallery-3.12.2
```

- install pipx : https://pipx.pypa.io/stable/installation/
- install poetry : https://python-poetry.org/docs/#installing-with-pipx, TDLR : `pipx install poetry`

```shell
$ cd ingest/ && poetry install
```

## Sites configuration

One folder per site in `sites/`, its name will now be called *site_id*.

Each site folder must contain a `config.json` file.

look at `sites/rp/config.json` to create your own `sites/[site_id]/config.json` and customize.


| key  | value meaning  |  example |
|---|---|---|
| GCPProjectId | The id of the GCP project on which we will store files ||
| sheetId  | This is the id of the google sheet that will be taken as source for  artworks data. This can be found in the google sheet editor URL : https://docs.google.com/spreadsheets/d/1xBYqjQpYiq0765Ftt3hRCo4qQFugmFchQA-78LnvWnM |  1xBYqjQpYiq0765Ftt3hRCo4qQFugmFchQA-78LnvWnM |
| bucketLocation | single region where the bucket data will reside. See [google location doc](https://cloud.google.com/storage/docs/locations)| EUROPE-WEST9 |


## speadsheets conventions

All speadsheet sources must obey these conventions for the ingestor to work properly.

- First row is your working column header, it is only for you, ignored by the ingestor.
- Second row maps artwork properties. Columns without value on this row will be ignored.
An artwork property must appear at most one time in the row.
There must be one column for special properties *id* and one column for *publish*.
- The third line is for the first artwork.
- Lines with no id will be ignored.
- 3 consécutives rows with empty id cell is considered as a stop for the ingestor, the sheet won't be read further.
 
You can leave blank sections in your sheet to organize your file, but no more than 2 in a row.

### available artwork properties

A spreedsheet don't have to map every available artwork properties. Only *id* and *publish* are mandatories.

| column id  | value meaning  |  examples |
|---|---|---|
| id  | The unique identifier of the artwork.<br>It can follow any convention you have for referencing the artworks.<br>It just has to be unique in the column and be non-empty.<br>At least one column must be mapped to the column id `id`. |  REF123, 456, _NF1 |
| publish | Use a **checkbox** in the spreadsheet cells for this one.<br>If TRUE then the artwork will be part of the generated artwork database.<br>if FALSE (or any value different from TRUE) it will be ignored.|TRUE|
| title |...|...|
| description |Long description, just test for now|...|
| remarks| additional (technical) information about the artwork|...|
| year | when was the artwork produced | 1999 |
| support |||
| technic |||
| width | integer, centimeters||
| height | integer, centimeters||
| depth | integer, centimeters||
| available |Use a **checkbox** in the spreadsheet cells for this one.<br>Tells whether the artwork is available for purchase / donation|TRUE|

## folder `sites/[site_id]/` structure

### `config.json`
already explained before

### `artworks.json`
Artworks database : created by the ingest command

### folder `assets`

this is where you put your source assets.

Image format is preferably lossless webp, the higher the resolution, the better.

No CLI command will ever add, delete or modify files in this folder because this is the source of truth for images.

must contains one image per artwork foudn in `artworks.json`, named `[artwork_id].(webp|jpg)`

## asset images resizings

each image in assets will be resized in several versions

- small : width 200px : for display in search page
- medium : width 400px : for display in artworks details page
- large : width 1600px : used for magnification on the frontend, loaded only if the user request magnification



## operations

### data ingestion

This the operation reading the source speadsheet of a site and generating the *artworks.json* file from it.


```shell
$ python -m cli ingest <site_id>
```

### assets management

- ensures a bucket exist for the site on the GCP project
- for each artwork found in `sites/[site_id]/artworks.json` :
  - ensure a file `sites/[site_id]/assets/[artwork_id].(jpg|webp)` exists, warns otherwise
  - for each image size (small, medium, large)
    - search for an object named `[size]/[artwork-id].webp` in the bucket
    - if not found then resize the source image and upload the resized version

```shell
$ python -m cli assets <site_id>
```

### assets backup

Files in `sites/[site_id]/assets` are the source for assets of a site, not a backup.

You are to ensure your source files are properly backed up outside gallery.

Nevertheless the following command is given to help it will create a bucket `gallery-sites-backup-[site_id]` and sent all files in `sites` in it if not present.

```shell
$ python -m cli backup <site_id>
```


-----------

TODO actualize

### Scripts

#### feed

This is the first step before building.

Converts the google spreadsheet data to a json database file.

```shell
$ bun feed <site_id>
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
