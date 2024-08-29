from json import dump
from datetime import datetime, timezone
from typing import TypedDict
from os import makedirs
from os.path import dirname

from cli.artworks.artwork import Artwork
from cli.command.ingest.sheet import SheetExtractedData
from cli.const import get_artworks_db_filepath, get_settings_filepath
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools import ctxOpen
from cli.website import WebsiteConfig


class Meta(TypedDict):
    generated: str
    source: str


class ArtworksFileContents(TypedDict):
    meta: Meta
    artworks: list[Artwork]


class SettingsFileContents(TypedDict):
    meta: Meta
    settings: dict[str, str]


def writeArtworksDB(site_config: WebsiteConfig, sheetData: SheetExtractedData):
    contents: ArtworksFileContents = {
        "meta": {
            "generated": datetime.now(timezone.utc).isoformat(),
            "source": sheetData.spreadsheetUrl,
        },
        "artworks": sheetData.artworks,
    }

    path = get_artworks_db_filepath(site_config.id)
    makedirs(dirname(path), exist_ok=True)

    with ctxOpen(path, "w") as artworksFile:
        try:
            dump(contents, artworksFile, indent="\t")
            log(f"Wrote {path}")
        except Exception as e:
            raise ProcessingException(f"Could not write {path} : {e}")


def writeSettingsFile(site_config: WebsiteConfig, sheetData: SheetExtractedData):
    contents: SettingsFileContents = {
        "meta": {
            "generated": datetime.now(timezone.utc).isoformat(),
            "source": sheetData.spreadsheetUrl,
        },
        "settings": sheetData.settings,
    }

    path = get_settings_filepath(site_config.id)
    makedirs(dirname(path), exist_ok=True)

    with ctxOpen(path, "w") as settingsFile:
        try:
            dump(contents, settingsFile, indent="\t")
            log(f"Wrote {path}")
        except Exception as e:
            raise ProcessingException(f"Could not write {path} : {e}")
