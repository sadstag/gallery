# type: ignore
# untyped google API client

from typing import Self

from google.cloud import storage

from google.cloud.storage import Client

from cli.website import WebsiteConfig
from cli.log import log


class Bucket:
    def __init__(
        self: Self,
        *,
        site_id: str,
        site_config: WebsiteConfig,
        predefined_acl: str = "private",
    ):
        self.site_id = site_id
        self.config = site_config
        self._storage_client = None
        self.predefined_acl = predefined_acl

    def _getClient(self: Self) -> Client:
        if self._storage_client is None:
            self._storage_client = storage.Client(project=self.config.GCPProjectId)
        return self._storage_client

    # to be overriden by children classes
    def get_bucket_name(self: Self) -> str | None:
        return None

    def ensure_exists(self: Self):
        bucket_name = self.get_bucket_name()
        client = self._getClient()
        buckets = client.list_buckets(prefix=bucket_name)
        if bucket_name not in [bucket.name for bucket in buckets]:
            log(f"bucket {bucket_name} not found, creating it")
            client.create_bucket(
                bucket_name,
                location=self.config.bucketLocation,
                predefined_acl=self.predefined_acl,
            )
            log(
                f"bucket {bucket_name} created on region {self.config.bucketLocation} "
                f"with predefined_acl '{self.predefined_acl}'"
            )
        else:
            log(f"bucket {bucket_name} exists")
