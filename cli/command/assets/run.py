from argparse import Namespace


from cli.artworks import readArtworks
from cli.command.assets.ResizedArtworksBucket import ResizedArtworksBucket
from cli.website import get_website_config


def run(args: Namespace):
    site_id = args.site_id
    site_config = get_website_config(site_id)
    artworks = readArtworks(site_id)
    bucket = ResizedArtworksBucket(
        site_id=site_id, site_config=site_config, predefined_acl="publicRead"
    )
    bucket.upload_resized_pictures(artworks)
