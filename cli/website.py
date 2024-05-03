from dataclasses import dataclass
from json import load
from json.decoder import JSONDecodeError
from os import scandir

from jsonschema import validate, ValidationError, SchemaError

from cli.const import (
    get_website_config_filepath,
    sites_folder_path,
    siteconfig_filename,
)
from cli.exceptions import ArgumentsException, ConfigurationException
from cli.log import log
from cli.tools.file import ctxOpen

config_schema = {
    "type": "object",
    "required": [
        "domain_name",
        "sheet_id",
        "bucket_names",
    ],
    "additionalProperties": False,
    "properties": {
        "domain_name": {
            "type": "string",
            "title": "domain_name",
            "description": "Domain name for the website",
        },
        "sheet_id": {
            "type": "string",
            "title": "sheet_id",
            "description": "id of the google sheet datasource",
            "minLength": 44,
            "maxLength": 44,
        },
        "bucket_names": {
            "type": "object",
            "title": "bucket_names",
            "required": ["assets", "app"],
            "additionalProperties": False,
            "properties": {
                "app": {
                    "type": "string",
                    "title": "app",
                    "description": "Name of the bucket containing app files, "
                    "if you get a 409 conflict error at creation try another one",
                },
                "assets": {
                    "type": "string",
                    "title": "assets",
                    "description": "Name of the bucket containing artworks resized files, "
                    "if you get a 409 conflict error at creation try another one",
                },
            },
        },
    },
}


@dataclass
class BucketNames:
    app: str
    assets: str

    def __json__(self):
        return self.__dict__


@dataclass
class WebsiteConfig:
    domain_name: str
    sheet_id: str
    bucket_names: BucketNames


siteIds: list[str] = []


def get_website_ids():
    global siteIds
    if not siteIds:
        siteIds = [file.name for file in scandir(sites_folder_path) if file.is_dir()]
        if not siteIds:
            raise ConfigurationException(
                "No site config is defined. "
                f"Create a folder for your site in folder '{sites_folder_path}', "
                f"with a '{siteconfig_filename}' file in it."
            )
    return siteIds


def get_website_domain_names():
    return [get_website_config(site_id).domain_name for site_id in get_website_ids()]


def get_website_config(site_id: str) -> WebsiteConfig:
    path = get_website_config_filepath(site_id)
    try:
        with ctxOpen(path, "r") as file:
            try:
                config = load(file)
            except JSONDecodeError as err:
                raise ConfigurationException(
                    f"Invalid json content in '{path}' :  :{err}"
                )

            try:
                validate(instance=config, schema=config_schema)
                log(f"Read configuration for site {site_id}")
            except SchemaError as err:
                raise Exception(
                    f"Dev error: Invalid website config schema !' : {err.message}"
                )
            except ValidationError as err:
                raise ConfigurationException(
                    f"Invalid json content in '{path}' : element '{err.json_path}' :{err.message}"
                )

    except OSError as err:
        raise ArgumentsException(f"Could not read file '{path}' : {err.strerror}")

    config["bucket_names"] = BucketNames(**(config.get("bucket_names")))

    return WebsiteConfig(**config)
