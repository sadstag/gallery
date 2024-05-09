from argparse import Namespace
from os import makedirs
from os.path import dirname, exists

from cli.PictureSize import PictureSize
from cli.artworks import PictureResizer, readArtworks
from cli.const import (
    get_artwork_images_output_filepath,
    get_site_input_images_folderpath,
)
from cli.log import log, warn


def run(args: Namespace):
    sid = args.site_id
    # site_config = get_website_config(sid)
    artworks = readArtworks(sid)

    missing_sources: list[str] = []

    for artwork in artworks:
        aid = artwork["id"]
        resizer = PictureResizer(sid, aid)
        if not resizer.source_file_exists():
            missing_sources.append(aid)
            continue

        for size in PictureSize:
            resizedPath = get_artwork_images_output_filepath(sid, aid, size)
            if not exists(resizedPath):
                makedirs(dirname(resizedPath), exist_ok=True)

                resizer.resize(size, resizedPath)
                log(f"created {resizedPath}")

    log("Done")

    if missing_sources:
        warn(
            f"No source picture in {get_site_input_images_folderpath(sid)} "
            "for the following artworks, "
            f"image processing was skipped : {missing_sources}"
        )

    # bucket = ResizedArtworksBucket(site_id=site_id, site_config=site_config)
    # bucket.upload_resized_pictures(artworks)
