from cli.artworks.ArtworkProperty import ArtworkProperty


def transtyper_int(v: str) -> int:
    return int(v)


def transtyper_bool(v: str) -> bool:
    return v == "TRUE"


transtypers = {
    ArtworkProperty.YEAR: transtyper_int,
    ArtworkProperty.WIDTH: transtyper_int,
    ArtworkProperty.HEIGHT: transtyper_int,
    ArtworkProperty.DEPTH: transtyper_int,
    ArtworkProperty.AVAILABLE: transtyper_bool,
    ArtworkProperty.DEFAULT_SORT: transtyper_int,
}


def transtype(value: str, property: ArtworkProperty):
    if property not in transtypers:
        return value
    return transtypers[property](value)
