from enum import UNIQUE, StrEnum, auto, verify
from typing import List, Set

from cli.exceptions import ProcessingException


@verify(UNIQUE)
class ArtworkProperty(StrEnum):
    # unique identifier for the artwork
    ID = auto()
    # whether put this artwork in db or ignore it
    PUBLISH = auto()

    # descriptive
    TITLE = auto()
    DESCRIPTION = auto()
    REMARKS = auto()
    YEAR = auto()

    # technical
    SUPPORT = auto()
    TECHNIC = auto()
    WIDTH = auto()
    HEIGHT = auto()
    DEPTH = auto()

    # stock
    AVAILABLE = auto()

    # webiste technical
    HIDDEN_AT_FIRST = auto()
    DEFAULT_SORT = auto()


def build_artwork_property_columns(
    column_ids_row: List[str],
) -> List[ArtworkProperty | None]:

    mapped: Set[str] = set()
    mapping: list[ArtworkProperty | None] = [None] * len(column_ids_row)

    for index, column_id in enumerate(column_ids_row):
        if column_id == "":
            continue
        if column_id not in ArtworkProperty:
            _raise(f"cell #{index} contains unknow artwork property '{column_id}'")
        if column_id in mapped:
            _raise(
                f"cell #{index} contains artwork property '{column_id}' "
                "which has already been mentioned in a previous cell"
            )
        mapping[index] = ArtworkProperty(column_id)
        mapped.add(column_id)

    if ArtworkProperty.ID.value not in mapped:
        _raise(f"No cell contains artwork property '{ArtworkProperty.ID.value}'")
    if ArtworkProperty.PUBLISH.value not in mapped:
        _raise(f"No cell contains artwork property '{ArtworkProperty.PUBLISH.value}'")

    return mapping


def _raise(msg: str):
    raise ProcessingException(
        f"Column Id header (second row of the spreadsheet) has an issue: {msg}"
    )
