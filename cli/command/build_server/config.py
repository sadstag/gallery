from typing import Any, Mapping
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools.file import ctxOpen
from cli.website import get_website_config, get_website_ids

from toml import dump


def buildSWSConfig(filename: str, *, dev: bool):
    site_ids = get_website_ids()

    config: Mapping[str, Any] = {
        "general": {
            "host": "::",
            "port": 80,
            "root": "./gallery",
            "log-level": "debug" if dev else "error",
            "cache-control-headers": True,
            "compression": True,
            "compression-level": "default",
            # Note: If a relative path is used then it will be resolved under the root directory.
            "page404": "./404.html",
            "page50x": "./50x.html",
            "http2": False,
            # "http2-tls-cert": "",
            # "http2-tls-key": "",
            # "https-redirect": False,
            # "https-redirect-host": "localhost",
            # "https-redirect-from-port": 80,
            # "https-redirect-from-hosts": "localhost",
            "directory-listing": False,
            "threads-multiplier": 2,
            "grace-period": 0,
            "log-remote-address": False,
            "redirect-trailing-slash": True,
            "compression-static": True,
            "health": False,
            "maintenance-mode": False,
        },
        "advanced": {
            "redirects": [{"source": "/index.html", "destination": "/", "kind": 301}],
        },
    }

    #
    # rewrites
    # every route managed by the front app must be rewriten to avoid 404
    rewrites: list[dict[str, str]] = []
    for source_glob in ("/artwork/**", "/presentation"):
        rewrites.append({"source": source_glob, "destination": "/"})
    config["advanced"]["rewrites"] = rewrites

    #
    # virtual hosts
    #
    virtual_hosts: list[dict[str, str]] = []

    for site_id in site_ids:
        site_config = get_website_config(site_id)
        virtual_hosts.append(
            {
                "host": f"{site_config.tech.domain_name}{':8080' if dev else ''}",
                "root": f"/gallery/{site_id}",
            }
        )

    config["advanced"]["virtual-hosts"] = virtual_hosts

    with ctxOpen(filename, "w") as configFile:

        try:
            dump(config, configFile)
            log(f"Wrote {filename} {'[DEV VARIANT]' if dev else ''}")
        except Exception as e:
            raise ProcessingException(f"Could not write {filename} : {e}")
