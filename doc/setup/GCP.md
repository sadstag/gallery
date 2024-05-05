# Gallery 

## Prerequisites

For each managed site choose a compact name (using letters,digits,dashes), we will call this name *site_id*, ex : my-website

Each site must (for now) have its own domain name.

All sites data will be hosted in a single region (for now). Choose it depending on who will visit the site the most.

## GCP related configuration

### create the project
- Create a new GCP project for handling these websites, ex : 'gallery'
- associate a billing account to this project
- activate the following APIs
    - google sheets API
    - cloud storage 
    - cloud DNS 
    - compute engine

### install gcloud CLI

as explained [here](https://cloud.google.com/sdk/docs/install)

then 
```shell
$ gcloud auth login # tell gcloud who you are
$ gcloud init # select any project now, the project selection will be made properly by the gallery CLI
```

and now (and every time you get strange errors related to unreachable project after messing up a bit with the GCP projects)
```shell
$ gcloud auth application-default login
```
this create the credentials file needed by the API client to operate on your GCP infrastructure

### define consent
Defining the oauth consent screen
The consent screen is what you'll see when you'll first run the Gallery CLI and connect on google APIs.
The important information is the test user : who can use this unnapproved application ? answer : you.

- go to https://console.cloud.google.com/apis/credentials/consent
- select type 'external' (unless you have workspace account).
- name: 'gallery' for instance
- scopes : select none.
- test user : add your email here.


### credentials
Getting credentials for your user so that the scripts can query sheet APIs on its behalf.
Your user must have read access to the artworks spreadsheets, if it's owner by someone else (spreadsheet must be shared with you with role 'reader').

This is used for speadsheet ingestion only.

- go to https://console.cloud.google.com/apis/credentials
- click on 'create identifiers' > 'OAuth client id'
- applicaton type : 'desktop app'
- name : ex : 'Gallery CLI'
- save json file as `credentials.json` in the root of local copy of gallery

## run cli terraform_config

## install terraform

following [official instructions](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

### initialize the terraform directory

```shell
$ cd terraform
$ terraform init
```

from now on every terraform command is to be done in this directory


### applying

this will provision your GCP infrastructure with the needed components

```shell
$ terraform apply
```

once the infrastructure is created you'll need to map your domain names to the reserved static IP.

find the static ip using
```shell
$ terraform state show google_compute_global_address.static_ip
# google_compute_global_address.static_ip:
resource "google_compute_global_address" "static_ip" {
    address            = "xxx.yyy.zzz.ttt"
...
```

Go to your domain name registrar and create/update the A records so that it points to that IP.

```
NAME                  TYPE     DATA
@                     A        <you static ip>
```


## Issues

### backend bucket limitation

If you have more than 1 site to manage you may end up with this error when doing `terraform apply`:

```
Error: Error waiting to create BackendBucket: Error waiting for Creating BackendBucket: Quota 'BACKEND_BUCKETS' exceeded.  Limit: 3.0 globally.
```

You need 2 * the number of managed site, and have to raise quotas following https://cloud.google.com/docs/quotas/view-manage, regarding the 'backend bucket' limitation (https://console.cloud.google.com/apis/api/compute.googleapis.com/quotas).