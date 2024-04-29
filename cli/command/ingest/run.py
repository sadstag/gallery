from argparse import Namespace

from cli.command.ingest.output import writeArtorksDB
from cli.command.ingest.sheet import extractSheetData
from cli.website import get_website_config


def run(args: Namespace):
    site_id = args.site_id
    siteConfig = get_website_config(site_id)
    sheetData = extractSheetData(siteConfig)
    writeArtorksDB(site_id, sheetData)
