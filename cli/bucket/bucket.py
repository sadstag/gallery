# type: ignore
# untyped google API client

from typing import Self

from google.cloud import storage

from google.cloud.storage import Client

from cli.website import WebsiteConfig
from cli.global_config import get_global_config


class Bucket:
    def __init__(self: Self, *, site_id: str, site_config: WebsiteConfig):
        self.site_id = site_id
        self.config = site_config
        self._storage_client = None

    def _getClient(self: Self) -> Client:
        if self._storage_client is None:
            self._storage_client = storage.Client(
                project=get_global_config().project_id
            )
        return self._storage_client
