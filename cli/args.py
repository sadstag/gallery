from argparse import ArgumentParser, Namespace
from typing import Any  # type: ignore

from cli.const import artworks_db_filename

from cli.website import get_website_ids, sites_folder_path


site_ids = get_website_ids()


def defineCommand(
    name: str, *, subparsers: Any, help: str, need_site_id: bool = True
) -> ArgumentParser:
    parser = subparsers.add_parser(
        name,
        help=help,
    )

    if need_site_id:
        parser.add_argument(
            "site_id",
            choices=site_ids,
            help=f"id of the site, it's the name of a folder in folder '{sites_folder_path}'",
        )

    return parser


def parseArguments() -> Namespace:

    parser = ArgumentParser(
        prog="python -m cli",
        description="Manage galleries, data feeding and web app deployment",
    )

    subparsers = parser.add_subparsers(title="command", required=True, dest="command")

    defineCommand(
        "ingest",
        subparsers=subparsers,
        help="fetch the google spreadsheet "
        f"and generates a {artworks_db_filename} file in site folder",
    )

    defineCommand(
        "assets",
        subparsers=subparsers,
        help="upload all derived assets not present on the site bucket",
    )

    defineCommand(
        "terraform_config",
        subparsers=subparsers,
        help="update terraform configuration after a change "
        "like global configuration modification, "
        "adding/remove a site, or site configuration modification",
        need_site_id=False,
    )

    return parser.parse_args()
