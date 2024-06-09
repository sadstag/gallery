from argparse import Namespace
from json import dump
from os import makedirs
from os.path import dirname

# json_fix monkey patches json.dump to allow easy serialization of classes
# nneded to write the content section of site config file into stabdalone json file in public dir
import json_fix  # type: ignore # noqa: F401.

from cli.command.ingest.output import writeArtorksDB
from cli.command.ingest.sheet import extractSheetData
from cli.command.site_id import get_target_site_id
from cli.const import get_content_filepath
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools.file import ctxOpen
from cli.website import get_website_config


def run(args: Namespace):
    site_id = get_target_site_id()
    site_config = get_website_config(site_id)

    path = get_content_filepath(site_id)
    makedirs(dirname(path), exist_ok=True)
    with ctxOpen(path, "w") as contentFile:
        try:
            dump(site_config.content, contentFile, indent="\t")
            log(f"Wrote {path}")
        except Exception as e:
            raise ProcessingException(f"Could not write {path} : {e}")

    sheetData = extractSheetData(site_config.tech)
    writeArtorksDB(site_config, sheetData)
