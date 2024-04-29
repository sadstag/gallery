from os.path import exists
from json import load

from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools import ctxOpen
from cli.artworks import Artwork
from cli.const import get_artworks_db_filepath


def readArtworks(site_id: str) -> list[Artwork]:
    path = get_artworks_db_filepath(site_id)

    if not exists(path):
        raise ProcessingException(
            f"Could not find file {path} : did you run the 'ingest' command ?"
        )

    with ctxOpen(path, "r") as artworksFile:
        try:
            contents = load(artworksFile)
            meta = contents["meta"]
            artworks = contents["artworks"]
            log(f"Read {len(artworks)} artworks from {path}")
            log(f"\tgenerated at {meta['generated']}\n\tfrom {meta['source']}")
        except Exception as e:
            raise ProcessingException(f"Could not read {path} : {e}")
    return artworks
