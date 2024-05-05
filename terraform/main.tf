variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "sites" {
  type = map(object({
    domain_name = string
    bucket_name = string
  }))
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  project = var.project_id
}

locals {
  site_ids = [for site_id, _ in var.sites : site_id]
}

resource "google_compute_global_address" "static_ip" {
  name = "gallery-static-ip-name"
}

resource "google_storage_bucket" "site_buckets" {
  for_each = {
    for site_id, config in var.sites :
    site_id => config.bucket_name
  }
  name                        = each.value
  location                    = var.region
  force_destroy               = true
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  #   cors {
  #     origin          = ["http://image-store.com"]
  #     method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
  #     response_header = ["*"]
  #     max_age_seconds = 3600
  #   }
}



resource "google_storage_bucket_iam_member" "site_buckets_authorizations" {
  for_each = toset(local.site_ids)
  bucket   = google_storage_bucket.site_buckets[each.key].id
  role     = "roles/storage.objectViewer"
  member   = "allUsers"
}


resource "google_compute_backend_bucket" "site_backend_buckets" {
  for_each    = toset(local.site_ids)
  name        = "gallery-backend-bucket-${each.key}"
  description = "Backend for bucket of site ${each.key}"
  bucket_name = google_storage_bucket.site_buckets[each.key].name
  #enable_cdn  = true
  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    client_ttl        = 3600
    default_ttl       = 3600
    max_ttl           = 86400
    negative_caching  = true
    serve_while_stale = 86400
  }
}

resource "google_compute_url_map" "default" {

  name        = "gallery-urlmap2"
  description = "URL mapper for gallery"

  #default_service = google_compute_backend_bucket.unmatched_host.id
  default_service = google_compute_backend_bucket.site_backend_buckets[local.site_ids[0]].id

  # maybe todo
  # default_route_action {
  #    url_rewrite {
  #           path_prefix_rewrite = "unknown_host.html/"
  #         }
  # }

  dynamic "host_rule" {
    for_each = toset(local.site_ids)
    iterator = each
    content {
      hosts        = ["${var.sites[each.key].domain_name}"]
      path_matcher = "site-${each.key}"
    }
  }

  dynamic "path_matcher" {
    for_each = toset(local.site_ids)
    iterator = each
    content {
      name            = "site-${each.key}"
      default_service = google_compute_backend_bucket.site_backend_buckets[each.key].id


    }
  }

}


resource "google_compute_target_http_proxy" "default" {
  name    = "gallery-http-proxy"
  url_map = google_compute_url_map.default.id
}

resource "google_compute_global_forwarding_rule" "default" {
  name                  = "gallery-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.default.id
  ip_address            = google_compute_global_address.static_ip.id
}
