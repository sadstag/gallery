# type: ignore
# untyped google API client

from typing import Any, List
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build


from cli.artworks import build_artworks
from cli.artworks import build_artwork_property_columns
from cli.creds import getCredentials
from cli.exceptions import ProcessingException
from cli.website import WebsiteConfig
from cli.log import log


class SheetExtractedData:
    spreadsheetUrl: str
    artworks: List[dict[str, Any]]


def extractSheetData(siteConfig: WebsiteConfig) -> SheetExtractedData:
    credentials = getCredentials()

    service = build("sheets", "v4", credentials=credentials)

    sheet = service.spreadsheets()

    extractedData = SheetExtractedData()

    try:
        spreadsheetInfo = sheet.get(
            spreadsheetId=siteConfig.sheetId,
        ).execute()
    except HttpError as e:
        if e.status_code == 403:
            raise ProcessingException(
                f"Could not retrieve sheet {siteConfig.sheetId} : "
                "permission denied : please request access before ingesting."
            )

    try:
        extractedData.spreadsheetUrl = spreadsheetInfo.get("spreadsheetUrl")

        result = (
            sheet.values()
            .get(
                spreadsheetId=siteConfig.sheetId,
                range="A:Z",  # arbitrary, ok for now
            )
            .execute()
        )
    except HttpError as e:
        raise ProcessingException(
            f"HTTP error while fetching sheet at {extractedData.spreadsheetUrl}: "
            f"status {e.status_code} : {e.reason}"
        )

    values = result.get("values", [])

    if len(values) < 2:
        raise ProcessingException(
            "Missing the two first rows : header row and column ids row\n\n"
            f"Check speadsheet URL : {extractedData.spreadsheetUrl}",
        )

    [_, column_ids_row, *potential_artwork_rows] = values

    artwork_property_columns = build_artwork_property_columns(column_ids_row)

    log(f"fetched {potential_artwork_rows.__len__()} rows")

    extractedData.artworks = build_artworks(
        potential_artwork_rows, artwork_property_columns
    )

    log(f"fetched {len(extractedData.artworks)} artworks")

    return extractedData
