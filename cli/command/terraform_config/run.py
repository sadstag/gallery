from argparse import Namespace
from json import dump

from cli.global_config import get_global_config
from cli.log import log
from cli.tools.file import ctxOpen
from cli.website import (
    get_website_config,
    get_website_ids,
)

from cli.const import get_terraform_variables_filename


def run(args: Namespace):

    global_config = get_global_config()

    site_ids = get_website_ids()

    site_configs = dict(
        zip(site_ids, [get_website_config(site_id) for site_id in site_ids])
    )

    with ctxOpen(get_terraform_variables_filename(), "w") as terraform_vars_file:

        dump(
            {
                "project_id": global_config.project_id,
                "region": global_config.region,
                "sites": {
                    site_id: {
                        "domain_name": site_config.domain_name,
                        "bucket_names": site_config.bucket_names,
                    }
                    for site_id, site_config in site_configs.items()
                },
            },
            terraform_vars_file,
            indent="\t",
        )

    log("DONE !\nnow run `terraform apply` in the terraform folder.")
