variable "project_name" {
  type    = string
  default = "usis-project"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "Your public IP CIDR for SSH to bastion, e.g. 1.2.3.4/32"
}

variable "key_name" {
  type        = string
  description = "EC2 keypair name in AWS (lab keypair name)"
}

variable "site_bucket_name" {
  type        = string
  description = "Existing S3 bucket name for frontend hosting"
}

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
  type        = string
  description = "Docker image for backend, must support linux/amd64"
}

variable "backend_health_path" {
  type    = string
  default = "/api/health"
}

variable "cloudtrail_bucket_name" {
  type        = string
  description = "Name of the MANUALLY created S3 bucket for CloudTrail logs"
}