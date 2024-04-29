from argparse import ArgumentParser, Namespace

from cli.const import artworks_db_filename

from cli.website import get_website_ids, sites_folder_path


def parseArguments() -> Namespace:
    parser = ArgumentParser(
        prog="python -m cli",
        description="Manage galleries, data feeding and web app deployment",
    )

    site_ids = get_website_ids()

    subparsers = parser.add_subparsers(title="command", required=True, dest="command")

    ingest_parser = subparsers.add_parser(
        "ingest",
        help="fetch the google spreadsheet "
        f"and generates a {artworks_db_filename} file in site folder",
    )

    ingest_parser.add_argument(
        "site_id",
        choices=site_ids,
        help=f"id of the site, it's the name of a folder in folder '{sites_folder_path}'",
    )

    assets_parser = subparsers.add_parser(
        "assets",
        help="upload all derived assets not present on the site bucket",
    )

    assets_parser.add_argument(
        "site_id",
        choices=site_ids,
        help=f"id of the site, it's the name of a folder in folder '{sites_folder_path}'",
    )

    backup_parser = subparsers.add_parser(
        "backup",
        help="upload all assets source files not present on the backup bucket",
    )

    backup_parser.add_argument(
        "site_id",
        choices=site_ids,
        help=f"id of the site, it's the name of a folder in folder '{sites_folder_path}'",
    )

    return parser.parse_args()
