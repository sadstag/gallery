variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "artifact_repository_name" {
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
      version = "5.31.0"
    }
  }
}

provider "google" {
  project = var.project_id
}

locals {
  site_ids = [for site_id, _ in var.sites : site_id]
}




resource "google_storage_bucket" "site_buckets" {
  for_each                    = var.sites
  name                        = each.value.bucket_name
  location                    = var.region
  force_destroy               = true
  uniform_bucket_level_access = true

  soft_delete_policy {
    retention_duration_seconds = 0
  }

  cors {
    origin          = ["http://${each.value.domain_name}"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 24 * 60 * 60
  }
}



resource "google_storage_bucket_iam_member" "site_buckets_authorizations" {
  for_each = toset(local.site_ids)
  bucket   = google_storage_bucket.site_buckets[each.key].id
  role     = "roles/storage.objectViewer"
  member   = "allUsers"
}


resource "google_artifact_registry_repository" "gallery-docker-images-repo" {
  location      = lower(var.region)
  repository_id = var.artifact_repository_name
  description   = "Docker images of gallery server"
  format        = "DOCKER"

  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "keep-last-three-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 3
    }
  }
}

resource "google_compute_address" "gallery_server_ip" {
  name         = "gallery-server-static-ip"
  region       = lower(var.region)
  network_tier = "STANDARD"
}

output "gallery_server_ip" {
  value = google_compute_address.gallery_server_ip.address
}
