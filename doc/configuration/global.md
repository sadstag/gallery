# global configuration file

A file named `global_config.json` has to be created at the root of the repository copy and filled when the informations get available while processing the configuration.

copy the sample and put the real values in :
```shell
$ copy global_config.sample.json global_config.json
```

Here are the keys in `global_config.json` :

| key | meaning |
| --- | --- |
| project_id | the GCP project if on which to host all the files and create the infrastructure elements, put the id of the project you created earlier |
| region | the region where to create buckets  |
