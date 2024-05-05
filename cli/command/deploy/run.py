from argparse import Namespace

from cli.const import get_site_dist_folderpath
from cli.exceptions import ProcessingException
from cli.log import err, log
from cli.website import get_website_config

from subprocess import run as subprocessRun


def run(args: Namespace):
    site_id = args.site_id
    site_config = get_website_config(site_id)

    distFolder = get_site_dist_folderpath(site_id)
    log(f'Syncing {distFolder} with bucket "{site_config.bucket_name}"')

    gcloud_args = [
        "gcloud",
        "storage",
        "rsync",
        distFolder,
        f"gs://{site_config.bucket_name}",
        "--recursive",
        "--delete-unmatched-destination-objects",
        "--exclude",
        ".*\\.DS_Store$",
    ]

    log(f"    => executing : {" ".join(gcloud_args)}")
    completedProcess = subprocessRun(gcloud_args, text=True, capture_output=True)

    if completedProcess.returncode != 0:
        err(completedProcess.stderr)
        raise ProcessingException(
            f"syncing failed with code {completedProcess.returncode}"
        )

    log(completedProcess.stdout)
    log(completedProcess.stderr)
