from dataclasses import dataclass
from json import load
from json.decoder import JSONDecodeError

from jsonschema import validate, ValidationError, SchemaError

from cli.const import (
    get_global_config_filepath,
)
from cli.exceptions import ArgumentsException, ConfigurationException
from cli.log import log
from cli.tools.file import ctxOpen

config_schema = {
    "type": "object",
    "properties": {
        "project_id": {
            "type": "string",
            "title": "project_id",
            "description": "id of the GCP project",
        },
        "region": {
            "type": "string",
            "title": "region",
            "description": "Location where the bucket data (website assets) "
            "and cloud functions will reside, "
            "see https://cloud.google.com/storage/docs/locations",
        },
        "artifact_repository_name": {
            "type": "string",
            "title": "artifact_repository_name",
            "description": "Name of the docker registry to be created and used",
        },
        "server_zone": {
            "type": "string",
            "title": "server_zone",
            "description": "GCP zone where to run the server",
        },
        "server_cos_image_name": {
            "type": "string",
            "title": "server_cos_image_name",
            "description": "Name of the google container optimized "
            "docker image to use for the server",
        },
    },
    "required": [
        "project_id",
        "region",
        "artifact_repository_name",
        "server_zone",
        "server_cos_image_name",
    ],
    "additionalProperties": False,
}


@dataclass
class GlobalConfig:
    project_id: str
    region: str
    artifact_repository_name: str
    server_zone: str
    server_cos_image_name: str


_global_config: GlobalConfig | None = None


def get_global_config() -> GlobalConfig:
    global _global_config
    if _global_config is None:
        _global_config = _read_global_config()
    return _global_config


def _read_global_config() -> GlobalConfig:
    path = get_global_config_filepath()
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
                log("Read global configuration")
            except SchemaError as err:
                raise Exception(
                    f"Dev error: Invalid global config schema !' : {err.message}"
                )
            except ValidationError as err:
                raise ConfigurationException(
                    f"Invalid json content in '{path}' : element '{err.json_path}' :{err.message}"
                )

    except OSError as err:
        raise ArgumentsException(f"Could not read file '{path}' : {err.strerror}")

    return GlobalConfig(**config)
