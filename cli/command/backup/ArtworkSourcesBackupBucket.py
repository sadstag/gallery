# type: ignore
# untyped google API client

from typing import Self

from os import scandir
from os.path import isdir, basename

from cli.log import log
from cli.const import (
    get_assets_source_backup_bucketname,
    get_assets_filepath,
)

from cli.bucket import Bucket


class ArtworkSourcesBackupBucket(Bucket):

    def get_bucket_name(self: Self) -> str | None:
        return get_assets_source_backup_bucketname(self.site_id)

    def backup(self: Self):

        self.ensure_exists()

        bucket_name = self.get_bucket_name()
        client = self._getClient()
        blobs = client.list_blobs(bucket_name)

        remoteBlobNames = [blob.name for blob in blobs]

        bucket = client.bucket(bucket_name)

        nb_ignored = 0
        nb_upload = 0
        nb_skipped = 0
        for f in scandir(get_assets_filepath(self.site_id)):
            filename = basename(f)
            if isdir(f):
                nb_ignored += 1
                log(f"folder {filename} ignored")
                continue
            if filename in remoteBlobNames:
                nb_skipped += 1
            else:
                nb_upload += 1
                log(f"File {filename} not in bucket, uploading it")
                blob = bucket.blob(filename)
                blob.upload_from_filename(f)

        log(f"{nb_ignored} folders/files ignored")
        log(f"{nb_skipped} files skipped (already in bucket)")
        log(f"{nb_upload} files uploaded")
