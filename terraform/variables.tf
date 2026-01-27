variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "project"
}

# Use your own IP in CIDR form (recommended): "x.x.x.x/32"
variable "allowed_ssh_cidr" {
  type    = string
  default = "0.0.0.0/0"
}

variable "key_name" {
  type = string
}

# RDS
variable "db_name" {
  type    = string
  default = "USIS_Project"
}

variable "db_username" {
  type    = string
  default = "admin"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "backend_container_image" {
  type = string
}

variable "backend_health_path" {
  type    = string
  default = "/"
}

variable "site_bucket_name" {
  type        = string
  description = "Existing S3 bucket name created manually in the AWS console (sandbox-safe)."
}

