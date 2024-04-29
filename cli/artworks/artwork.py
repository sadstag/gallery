from typing import Any, List

from cli.artworks.ArtworkProperty import ArtworkProperty
from cli.exceptions import ProcessingException
from cli.log import log
from cli.artworks.transtype import transtype

Artwork = dict[str, Any]


def build_artworks(
    potential_artwork_rows: List[List[str]],
    artwork_property_columns: List[ArtworkProperty | None],
) -> List[Artwork]:
    try:
        idIndex = artwork_property_columns.index(ArtworkProperty.ID)
        publishIndex = artwork_property_columns.index(ArtworkProperty.PUBLISH)
    except ValueError:
        # should have been checked when building artowork_property_columns
        raise Exception(
            "one of or both of property 'id' and property 'publish' "
            "are missing in artwork_property_columns"
        )

    artworks: List[Artwork] = []

    empty_rows = 0
    for rowIndex, potential_artwork in enumerate(potential_artwork_rows):
        if idIndex >= len(potential_artwork) or potential_artwork[idIndex] == "":
            empty_rows += 1
            if empty_rows == 3:
                log(
                    f"Third empty consecutive row found at row#{rowIndex+3}, ingestion ends"
                )
                break
            continue
        empty_rows = 0
        if is_false(potential_artwork[publishIndex]):
            continue
        artwork: Artwork = {}
        for colIndex, property in enumerate(artwork_property_columns):
            if (
                property
                and (colIndex < len(potential_artwork))
                and potential_artwork[colIndex]
            ):
                try:
                    artwork[property] = transtype(potential_artwork[colIndex], property)
                except ValueError:
                    raise ProcessingException(
                        f"Value for property '{property}' row#{rowIndex+3} "
                        f"could not be ingested: '{potential_artwork[colIndex]}'"
                    )

        del artwork[ArtworkProperty.PUBLISH.value]
        artworks.append(artwork)

    return artworks


# won't publish if not explicitely told to do so (only 'TRUE' means publish)
def is_false(v: str):
    return v != "TRUE"
