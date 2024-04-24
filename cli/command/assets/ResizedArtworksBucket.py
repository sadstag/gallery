# type: ignore
# untyped google API client

from typing import Self


from cli.const import get_assets_bucketname, get_assets_filepath

from cli.artworks import Artwork, PictureResizer
from cli.log import log, warn
from cli.bucket import Bucket


class ResizedArtworksBucket(Bucket):

    def get_bucket_name(self: Self) -> str | None:
        return get_assets_bucketname(self.site_id)

    def upload_resized_pictures(self: Self, artworks: list[Artwork]):

        self.ensure_exists()

        client = self._getClient()

        bucket_name = self.get_bucket_name()

        blobs = client.list_blobs(bucket_name)

        remoteBlobNames = [blob.name for blob in blobs]

        bucket = client.bucket(bucket_name)

        missing_sources = []

        for artwork in artworks:
            resizer = PictureResizer(self.site_id, artwork["id"])
            if not resizer.source_file_exists():
                missing_sources.append(artwork["id"])
                continue
            for size, blobName in resizer.get_all_resized_pictures_blobnames():
                if blobName not in remoteBlobNames:
                    tmpFile = resizer.resize(size)
                    blob = bucket.blob(blobName)
                    blob.upload_from_filename(tmpFile)
                    log(f"resized and uploaded to blob {blobName}")
                else:
                    log(f"blob exists : {blobName}")

        if missing_sources:
            warn(
                f"No source picture in {get_assets_filepath(self.site_id)} "
                "for the following artworks, "
                f"image processing was skipped : {missing_sources}"
            )

        # Note: The call returns a response only when the iterator is consumed.
        # for blob in blobs:
        #     log(blob.name)

        # blob = bucket.blob(destination_blob_name)
