# Gallery GCP related configuration

## Prerequisites

For each managed site choose a compact name (letters,digits,dashes), we will call this name *site_id*, ex : my-website

Each site must (for now) have its own domain name.

All sites data will be hosted in a single region (for now). Choose it depending on who will visit the site the most.

A file named `global_config.json` has to be created at the root of the repository copy and filled when the informations get available while processing the configuration.

copy the sample and put the real values in :
```shell
$ copy global_config.sample.json global_config.json
```

Here are the keys in `global_config.json` :

| key | meaning |
| --- | --- |
| project_id | the GCP project if on which to host all the files and create the cloud function |
| region | the region where to create buckets and other things |



## create the project
- Create a new GCP project for handling these websites, ex : 'gallery', put that in `global_config.json`
- associate a billing account to this project
- activate the following APIs
    - google sheets API
    - cloud storage 
    - cloud DNS 
    - cloud functions 
    - cloud build 
    - compute engine
    - Certificate Manager

## install gcloud CLI

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

## define consent
Defining the oauth consent screen
The consent screen is what you'll see when you'll first run the Gallery CLI and connect on google APIs.
The important information is the test user : who can use this unnapproved application ? answer : you.

- go to https://console.cloud.google.com/apis/credentials/consent
- select type 'external' (unless you have workspace account).
- name: 'gallery' for instance
- scopes : select none.
- test user : add your email here.


## credentials
Getting credentials for your user so that the scripts can query sheet APIs on its behalf.
Your user must have read access to the artworks spreadsheets, if it's owner by someone else (spreadsheet must be shared with you with role 'reader').

This is used for speadsheet ingestion only.

- go to https://console.cloud.google.com/apis/credentials
- click on 'create identifiers' > 'OAuth client id'
- applicaton type : 'desktop app'
- name : ex : 'Gallery CLI'
- save json file as `credentials.json` in the root of local copy of gallery

## install terraform

    following [official instructions](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

## initialize the terraform directory

```shell
$ cd terraform
$ terraform init
```

from now on every terraform command is to be done in this directory


## applying

this will provision your GCP infrastructure with the needed components

```shell
$ terraform apply
```

----
TODO clean


## deploy

now use the command *deploy* to setup your project.

This will create every entity needed to have the gallery 'server' up and running.
After this step you'll create the site files as explained in the main README

```shell
$ python -m cli deploy
```

if everything goes well then you should see your static IP at the end.
You'll have to add the following records on your registrar, once per domain name

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