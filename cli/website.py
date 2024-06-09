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
        "tech",
    ],
    "additionalProperties": False,
    "properties": {
        "tech": {
            "type": "object",
            "required": [
                "domain_name",
                "sheet_id",
                "bucket_name",
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
                "bucket_name": {
                    "type": "string",
                    "title": "bucket_name",
                    "description": "Name of the site bucket, try another name if already taken",
                    "minLength": 10,
                    "maxLength": 64,
                },
            },
        },
        "content": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "title": {
                    "type": "string",
                    "title": "title",
                    "description": "Tifle of the website",
                },
                "subtitle": {
                    "type": "string",
                    "title": "subtitle",
                    "description": "subtitle of the website",
                },
                "presentation": {
                    "type": "string",
                    "title": "presentation",
                    "description": "Short description of the website and author",
                },
            },
        },
    },
}


@dataclass
class WebsiteConfigTech:
    domain_name: str
    sheet_id: str
    bucket_name: str

    def __json__(self):
        return self.__dict__


@dataclass
class WebsiteConfigContent:
    title: str
    subtitle: str
    presentation: str

    def __json__(self):
        return self.__dict__


@dataclass
class WebsiteConfig:
    id: str
    tech: WebsiteConfigTech
    content: WebsiteConfigContent


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

    config["id"] = site_id
    config["tech"] = WebsiteConfigTech(**(config.get("tech")))
    config["content"] = WebsiteConfigContent(**(config.get("content")))

    return WebsiteConfig(**config)
