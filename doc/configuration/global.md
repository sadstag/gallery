# global configuration file

A file named `global_config.json` has to be created at the root of the repository copy and filled when the informations get available while processing the configuration.

copy the sample and put the real values in :

```shell
$ cp global_config.sample.json global_config.json
```

Here are the keys in `global_config.json` :

| key                      | meaning                                                                                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| project_id               | the GCP project if on which to host all the files and create the infrastructure elements, put the id of the project you created earlier                                                                   |
| region                   | the region where to create buckets                                                                                                                                                                        |
| artifact_repository_name | the name of artifacts repository, could be anything, why not "gallery-docker-images"                                                                                                                      |
| server_zone              | GCP zone where to run the server                                                                                                                                                                          |
| server_cos_image_name    | name opf the google container optimized docker image to use for the server. You should always put the [latest available version](https://cloud.google.com/container-optimized-os/docs/release-notes/m101) |
