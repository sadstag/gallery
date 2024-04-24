from json import dump
from datetime import datetime, timezone
from typing import TypedDict

from cli.artworks.artwork import Artwork
from cli.command.ingest.sheet import SheetExtractedData
from cli.const import get_artworks_db_filepath
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools import ctxOpen


class Meta(TypedDict):
    generated: str
    source: str


class ArtworksFileContents(TypedDict):
    meta: Meta
    artworks: list[Artwork]


def writeArtorksDB(siteId: str, sheetData: SheetExtractedData):
    contents: ArtworksFileContents = {
        "meta": {
            "generated": datetime.now(timezone.utc).isoformat(),
            "source": sheetData.spreadsheetUrl,
        },
        "artworks": sheetData.artworks,
    }

    path = get_artworks_db_filepath(siteId)
    with ctxOpen(path, "w") as artworksFile:
        try:
            dump(contents, artworksFile, indent="\t")
            log(f"Wrote {path}")
        except Exception as e:
            raise ProcessingException(f"Could not write {path} : {e}")
