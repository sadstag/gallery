# Gallery

Simple gallery website for promoting an artist.

It takes google spreadsheets describing artworks and deploys a 100% front application to display them.

<!-- Tech Stack :

- CLI : python 3
- catalog datasource : google sheets
- Infra : google cloud platform
- Front : bun, vite, solidjs -->

## Setting things up

These are the step to follow in order to have your site deployed:

## things to setup once

- [setting up GCP](doc/setup/GCP.md)
- [setting up you dev environment](doc/setup/dev.md)
- [defining your global configuration](doc/configuration/global.md)

## adding a site

Choose an _site_id_ for your site, something short and meaningful (with letters and digits).

You should have your google spreadsheet artworks catalog ready, with at least a few artworks in it to start with.
Report to [this doc](doc/spreadsheet.md) for informations about gallery spreadsheet datasources and how to create one.

## configuration file

Create a folder named like your _site_id_ in the folder `sites`.

Create a file `sites/[site_id]/input/config.json`, you can copy`sites/demo/input/config.json` to create your own and customize.

Report to [this doc](doc/configuration/per-side.md) for detailed information.

## speadsheet ingestion

it's time to absorb the content of the source spreadsheet, execute :

```shell
$ SITE=[site_id] ./gallery.sh ingest
```

This should produce a file : `sites/[site_id]/public/artwork.json`

## give artworks images

Put the images corresponding to your artworks in a new folder `sites/[site_id]/input/images`

Each file should be named `[artwork_id].[ext]` where _artwork_id_ is the id of artwork in the source spreadsheet and _ext_ is either 'jpg' either 'webp'.

For better results images shoéuld be in lossless webp format and width should be greater than 2400 pixels.

## resize artworks images

Ask the gallery CLI tool to do the resizing of the artworks images :

```shell
$ SITE=[site_id] ./gallery.sh resize
```

this should produce all variants of resized images in `sites/[site_id]/public/artworks/images`.

## building the front app

It's now to build the web app.

```shell
$ SITE=[site_id] ./gallery.sh build_front
```

now you should be able to preview using

```shell
$ SITE=[site_id] ./gallery.sh preview_front
```

## deploying the app

### have terraform config setup/updated

terraform does the provisionning of the needed resource on GCP :

- buckets (one per site), public access
- static IP to be attached to the server virtual machine
- artifact repository for storing docker images of the server

It can be done only when the first site is configured.

```shell
$ ./gallery.sh terraform_config # this create the terraform configuration file : terraform/terraform.tfvars.json
$ ./gallery.sh terraform init # terrform will load GCP related terraform providers : should be done once only
$ ./gallery.sh terraform apply # this does the provisionning
```

### directing domain names

once the infrastructure is created you'll need to map your domain names to the reserved static IP.

find the static ip using

```shell
$ ./gallery.sh terraform output
# outputs:
# gallery_server_ip = "xxx.xxx.xxx.xxx"
```

Go to your domain name registrar and create/update the A records so that it points to that IP.

```
NAME                  TYPE     DATA
@                     A        <you static ip>
```

## folder `sites/[site_id]/` structure

TODO maybe

## CLI commands

Here are all available CLI commands and what they do. Details in the next sections

<!-- TODO explains here all gallery.sh targets -->

| command | purpose                                                                  |
| ------- | ------------------------------------------------------------------------ |
| Common  |
| ingest  | read spreadsheet of a site to generate the _artworks.json_ database file |
| assets  | reduce and upload all assets of site in a dedicated bucket               |

## common CLI command details

### data ingestion

This the operation reading the source speadsheet of a site and generating the _artworks.json_ file from it.

```shell
$ SITE=[site_id] ./gallery.sh ingest
```

### image resizing

creates resized versions of source artworks

```shell
$ SITE=[site_id] ./gallery.sh resize
```

### bucket sync

Sent all resized images to GCP buckets

```shell
$ SITE=[site_id] ./gallery.sh sync_bucket
```

### building server docker image

Using SWS (+link)

```shell
$ ./gallery.sh build_server
```

then

```shell
$ ./gallery.sh deploy_server
```

### about dev image

option `-d` for building dev image suitable for local testing.

Specificities:

- uses port 8080 on host to relay container port 80
- virtual host configuration refers to port 8080

In order to test the image locally you would have to

- first ingest the datasheet, the build the front
- modifiy `/etc/hosts` to have your domain names point to `127.0.0.1`
  - don't forget to remove these lines when testing prod
- build image

```shell
$ ./gallery.sh build_server_dev
```

- run image

```shell
$ cd sites
$ docker build . -t gallery && docker run --rm --name gallery_instance -p 8080:80 gallery
```

- browse `http://<domain_name>:8080`
