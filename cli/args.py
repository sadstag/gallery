from argparse import ArgumentParser, Namespace
from typing import Any  # type: ignore

from cli.const import artworks_db_filename

from cli.website import get_website_ids


site_ids = get_website_ids()


def defineCommand(name: str, *, subparsers: Any, help: str) -> ArgumentParser:
    parser = subparsers.add_parser(
        name,
        help=help,
    )

    return parser


def parseArguments() -> Namespace:

    parser = ArgumentParser(
        prog="python -m cli",
        description="Manage galleries, data feeding and web app deployment",
    )

    subparsers = parser.add_subparsers(title="command", required=True, dest="command")

    defineCommand(
        "terraform_config",
        subparsers=subparsers,
        help="update terraform configuration after a change "
        "like global configuration modification, "
        "adding/remove a site, or site configuration modification",
    )

    defineCommand(
        "ingest",
        subparsers=subparsers,
        help="fetch the google spreadsheet "
        f"and generates a {artworks_db_filename} file in site folder",
    )

    resize_parser = defineCommand(
        "resize",
        subparsers=subparsers,
        help="resize all artwork images, putting them in sites/[site_id]/output/assets/images",
    )

    resize_parser.add_argument(
        "-f",
        "--force",
        action="store_true",
        help="recreate resized version of images even if they already exists, "
        "useful if some configuration changed which demands invalidation of all thumbnails",
    )

    defineCommand(
        "sync_bucket",
        subparsers=subparsers,
        help="synchronize local artworks related assets with bucket",
    )

    build_server_parser = defineCommand(
        "build_server",
        subparsers=subparsers,
        help="create server docker image after fronts has been built",
    )

    build_server_parser.add_argument(
        "-d",
        "--dev",
        action="store_true",
        help="create an image suitable for dev environment, mainly because of virtual hosting",
    )

    defineCommand(
        "deploy_server",
        subparsers=subparsers,
        help="Create and run a VM running the gallery server in docker",
    )

    return parser.parse_args()
