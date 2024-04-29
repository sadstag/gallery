from argparse import Namespace


from cli.command.backup.ArtworkSourcesBackupBucket import ArtworkSourcesBackupBucket
from cli.website import get_website_config


def run(args: Namespace):
    site_id = args.site_id

    site_config = get_website_config(site_id)

    bucket = ArtworkSourcesBackupBucket(
        site_id=site_id, site_config=site_config, predefined_acl="private"
    )

    bucket.backup()
