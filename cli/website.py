from dataclasses import dataclass
from json import load
from os import scandir
from cli.const import (
    get_website_config_filepath,
    sites_folder_path,
    siteconfig_filename,
)
from jsonschema import validate, ValidationError, SchemaError

from cli.exceptions import ArgumentsException, ConfigurationException
from cli.log import log
from cli.tools.file import ctxOpen

configSchema = {
    "type": "object",
    "properties": {
        "GCPProjectId": {
            "type": "string",
            "title": "GCPProjectId",
            "description": "id of the GCP project",
        },
        "sheetId": {
            "type": "string",
            "title": "sheetId",
            "description": "id of the google sheet datasource",
            "minLength": 44,
            "maxLength": 44,
        },
        "bucketLocation": {
            "type": "string",
            "title": "bucketLocation",
            "description": "Location where the bucket data (website assets) will reside, "
            "see https://cloud.google.com/storage/docs/locations",
        },
    },
    "required": ["sheetId"],
}


@dataclass
class WebsiteConfig:
    GCPProjectId: str
    sheetId: str
    bucketLocation: str


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


def get_website_config(site_id: str) -> WebsiteConfig:
    path = get_website_config_filepath(site_id)
    with ctxOpen(path, "r") as file:
        try:
            config = load(file)
            validate(instance=config, schema=configSchema)
            log(f"Read configuration for site {site_id}")
        except OSError as err:
            raise ArgumentsException(f"Could not read file '{path}' : {err.strerror}")
        except SchemaError as err:
            raise Exception(
                f"Dev error: Invalid website config schema !' : {err.message}"
            )
        except ValidationError as err:
            raise ConfigurationException(
                f"Invalid json content in '{path}' : element '{err.json_path}' :{err.message}"
            )
    return WebsiteConfig(**config)
