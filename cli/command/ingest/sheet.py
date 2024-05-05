# type: ignore
# untyped google API client

from typing import Any, List
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build


from cli.artworks import build_artworks
from cli.artworks import build_artwork_property_columns
from cli.creds import getCredentials
from cli.exceptions import ProcessingException
from cli.website import WebsiteConfigTech
from cli.log import log


class SheetExtractedData:
    spreadsheetUrl: str
    artworks: List[dict[str, Any]]


def extractSheetData(siteConfig: WebsiteConfigTech) -> SheetExtractedData:
    credentials = getCredentials()

    service = build("sheets", "v4", credentials=credentials)

    sheet = service.spreadsheets()

    extractedData = SheetExtractedData()

    try:
        spreadsheetInfo = sheet.get(
            spreadsheetId=siteConfig.sheet_id,
        ).execute()
    except HttpError as e:
        if e.status_code == 403:
            raise ProcessingException(
                f"Could not retrieve sheet {siteConfig.sheet_id} : "
                "permission denied : please request access before ingesting, "
                "or maybe your credentials.json is no longer valid, "
                "in that case create a new one following the README and remove token.json"
            )

    try:
        extractedData.spreadsheetUrl = spreadsheetInfo.get("spreadsheetUrl")

        result = (
            sheet.values()
            .get(
                spreadsheetId=siteConfig.sheet_id,
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
