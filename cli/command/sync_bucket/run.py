from argparse import Namespace

from cli.command.site_id import get_target_site_id
from cli.command.subprocessRun import subprocessRun
from cli.const import get_site_dist_artworks_folderpath
from cli.log import log
from cli.website import get_website_config


def run(args: Namespace):
    site_id = get_target_site_id()
    site_config = get_website_config(site_id)

    distFolder = get_site_dist_artworks_folderpath(site_id)
    log(f'Syncing {distFolder} with bucket "{site_config.tech.bucket_name}"')

    gcloud_args = [
        "gcloud",
        "storage",
        "rsync",
        distFolder,
        f"gs://{site_config.tech.bucket_name}/artworks",
        "--recursive",
        "--delete-unmatched-destination-objects",
        "--exclude",
        ".*\\.DS_Store$",
    ]

    subprocessRun(gcloud_args, "syncing")
