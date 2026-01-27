############################
# VPC
############################
resource "aws_vpc" "this" {
  cidr_block                       = "10.0.0.0/16"
  enable_dns_hostnames             = true
  enable_dns_support               = true
  # MODIFIED: Enable IPv6
  assign_generated_ipv6_cidr_block = true
   
  tags = { Name = "${var.project_name}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project_name}-igw" }
}

############################
# Subnets (2 public + 4 private)
############################

# Public (ALB + NAT)
resource "aws_subnet" "public_a" {
  vpc_id                          = aws_vpc.this.id
  cidr_block                      = "10.0.1.0/24"
  availability_zone               = "us-east-1a"
  map_public_ip_on_launch         = true
   
  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 0)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-public-1a" }
}

resource "aws_subnet" "public_b" {
  vpc_id                          = aws_vpc.this.id
  cidr_block                      = "10.0.2.0/24"
  availability_zone               = "us-east-1b"
  map_public_ip_on_launch         = true

  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 1)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-public-1b" }
}

# Private APP (Backend EC2)
resource "aws_subnet" "private_app_a" {
  vpc_id                          = aws_vpc.this.id
  cidr_block                      = "10.0.11.0/24"
  availability_zone               = "us-east-1a"
   
  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 2)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-private-app-1a" }
}

resource "aws_subnet" "private_app_b" {
  vpc_id                          = aws_vpc.this.id
  cidr_block                      = "10.0.12.0/24"
  availability_zone               = "us-east-1b"
   
  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 3)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-private-app-1b" }
}

# Private DB
resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "us-east-1a"
   
  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 4)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-private-db-1a" }
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.22.0/24"
  availability_zone = "us-east-1b"
   
  # IPv6
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, 5)
  assign_ipv6_address_on_creation = true

  tags = { Name = "${var.project_name}-private-db-1b" }
}


############################
# Network ACLs (NACL)
############################
# Public NACL
resource "aws_network_acl" "public_nacl" {
  vpc_id = aws_vpc.this.id

  # Inbound Rules
  ingress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  ingress {
    protocol        = "-1"
    rule_no         = 101
    action          = "allow"
    ipv6_cidr_block = "::/0"
    from_port       = 0
    to_port         = 0
  }

  # Outbound Rules
  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  egress {
    protocol        = "-1"
    rule_no         = 101
    action          = "allow"
    ipv6_cidr_block = "::/0"
    from_port       = 0
    to_port         = 0
  }

  tags = { Name = "${var.project_name}-public-nacl" }
}

resource "aws_network_acl_association" "public_a" {
  network_acl_id = aws_network_acl.public_nacl.id
  subnet_id      = aws_subnet.public_a.id
}

resource "aws_network_acl_association" "public_b" {
  network_acl_id = aws_network_acl.public_nacl.id
  subnet_id      = aws_subnet.public_b.id
}

# Private NACL
resource "aws_network_acl" "private_nacl" {
  vpc_id = aws_vpc.this.id

  # Inbound Rules
  ingress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  ingress {
    protocol        = "-1"
    rule_no         = 101
    action          = "allow"
    ipv6_cidr_block = "::/0"
    from_port       = 0
    to_port         = 0
  }

  # Outbound Rules
  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
  egress {
    protocol        = "-1"
    rule_no         = 101
    action          = "allow"
    ipv6_cidr_block = "::/0"
    from_port       = 0
    to_port         = 0
  }

  tags = { Name = "${var.project_name}-private-nacl" }
}

resource "aws_network_acl_association" "private_app_a" {
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = aws_subnet.private_app_a.id
}

resource "aws_network_acl_association" "private_app_b" {
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = aws_subnet.private_app_b.id
}

resource "aws_network_acl_association" "private_db_a" {
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = aws_subnet.private_db_a.id
}

resource "aws_network_acl_association" "private_db_b" {
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = aws_subnet.private_db_b.id
}

############################
# Route tables
############################
# Public RT -> IGW
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route" "public_default" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route" "public_default_ipv6" {
  route_table_id              = aws_route_table.public_rt.id
  destination_ipv6_cidr_block = "::/0"
  gateway_id                  = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_a_assoc" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_b_assoc" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public_rt.id
}

# NAT Gateway (IPv4 only, standard for Academy)
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags   = { Name = "${var.project_name}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_a.id
  depends_on    = [aws_internet_gateway.igw]
  tags          = { Name = "${var.project_name}-nat" }
}

# Private RT -> NAT (IPv4 only)
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project_name}-private-rt" }
}

resource "aws_route" "private_default" {
  route_table_id         = aws_route_table.private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

resource "aws_route_table_association" "private_app_a_assoc" {
  subnet_id      = aws_subnet.private_app_a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_app_b_assoc" {
  subnet_id      = aws_subnet.private_app_b.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_db_a_assoc" {
  subnet_id      = aws_subnet.private_db_a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_db_b_assoc" {
  subnet_id      = aws_subnet.private_db_b.id
  route_table_id = aws_route_table.private_rt.id
}

############################
# Security Groups
############################
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

resource "aws_security_group" "alb_sg" {
  name   = "${var.project_name}-alb-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    description     = "HTTP from CloudFront only"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    # Managed Prefix List includes both IPv4 and IPv6 automatically
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  egress {
    description      = "All egress"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    # MODIFIED: Allow IPv6 Egress
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = { Name = "${var.project_name}-alb-sg" }
}

resource "aws_security_group" "backend_sg" {
  name   = "${var.project_name}-backend-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    description     = "8080 from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description      = "All egress"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    # MODIFIED: Allow IPv6 Egress
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = { Name = "${var.project_name}-backend-sg" }
}

resource "aws_security_group" "rds_sg" {
  name   = "${var.project_name}-rds-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    description     = "MySQL from backend EC2 only"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }

  egress {
    description      = "All egress"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    # MODIFIED: Allow IPv6 Egress
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = { Name = "${var.project_name}-rds-sg" }
}

############################
# RDS Subnet Group + MySQL
############################
resource "aws_db_subnet_group" "rds_subnet_group" {
  name        = "${var.project_name}-rds-subnet-group"
  subnet_ids = [aws_subnet.private_db_a.id, aws_subnet.private_db_b.id]
  tags        = { Name = "${var.project_name}-rds-subnet-group" }
}

resource "aws_db_instance" "mysql" {
  identifier        = "${var.project_name}-mysql"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  publicly_accessible = false
  multi_az            = false

  skip_final_snapshot = true
  deletion_protection = false

  tags = { Name = "${var.project_name}-mysql" }
}

resource "aws_db_snapshot" "mysql_snapshot" {
  db_instance_identifier = aws_db_instance.mysql.identifier
  db_snapshot_identifier = "${var.project_name}-rds-snapshot"
   
  tags = { Name = "${var.project_name}-rds-snapshot" }
}

############################
# AMI: Amazon Linux 2
############################
data "aws_ami" "al2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

data "aws_iam_instance_profile" "lab_profile" {
  name = "LabInstanceProfile"
}

############################
# ALB -> Target Group (8080) -> backend instances
############################
resource "aws_lb" "alb" {
  name                 = "${var.project_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
   
  ip_address_type    = "dualstack" 
   
  tags                 = { Name = "${var.project_name}-alb" }
}

resource "aws_lb_target_group" "backend_tg" {
  name        = "${var.project_name}-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.this.id
  target_type = "instance"

  health_check {
    protocol = "HTTP"
    path     = var.backend_health_path
    matcher  = "200-399"
  }

  tags = { Name = "${var.project_name}-backend-tg" }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Access Denied - CloudFront Only"
      status_code  = "403"
    }
  }
}

resource "aws_lb_listener_rule" "verify_header" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }

  condition {
    http_header {
      http_header_name = "X-Origin-Verify"
      values           = [random_password.alb_secret.result]
    }
  }
}

resource "random_password" "alb_secret" {
  length           = 32
  special          = false
  override_special = "_%@"
}

############################
# EC2: Backend-1/2
############################
locals {
  jdbc_url = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/${var.db_name}"
  dist_dir = "${path.module}/../frontend/dist"

  backend_user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    yum update -y
    amazon-linux-extras install docker -y || yum install -y docker
    systemctl enable docker
    systemctl start docker

    # Pull & run backend
    docker pull ${var.backend_container_image}
    docker rm -f backend || true

    docker run -d --name backend \
      -p 8080:8080 \
      -e SPRING_DATASOURCE_URL='${local.jdbc_url}' \
      -e SPRING_DATASOURCE_USERNAME='${var.db_username}' \
      -e SPRING_DATASOURCE_PASSWORD='${var.db_password}' \
      ${var.backend_container_image}
  EOF
}

resource "aws_instance" "backend_1" {
  ami                      = data.aws_ami.al2.id
  instance_type            = "t3.small"
  subnet_id                = aws_subnet.private_app_a.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name                 = var.key_name
  user_data                = local.backend_user_data

  iam_instance_profile     = data.aws_iam_instance_profile.lab_profile.name
   
  tags                     = { Name = "backend-1" }
}

resource "aws_instance" "backend_2" {
  ami                      = data.aws_ami.al2.id
  instance_type            = "t3.small"
  subnet_id                = aws_subnet.private_app_b.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name                 = var.key_name
  user_data                = local.backend_user_data

  iam_instance_profile     = data.aws_iam_instance_profile.lab_profile.name

  tags                     = { Name = "backend-2" }
}

resource "aws_lb_target_group_attachment" "backend_1_attach" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = aws_instance.backend_1.id
  port             = 8080
}

resource "aws_lb_target_group_attachment" "backend_2_attach" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = aws_instance.backend_2.id
  port             = 8080
}

############################
# S3 (PRIVATE) + upload 
############################
resource "null_resource" "upload_frontend_and_config" {
  triggers = {
    dist_hash = sha1(join("", [
      for f in fileset(local.dist_dir, "**/*") : filesha1("${local.dist_dir}/${f}")
    ]))
  }

  # MODIFIED: Uses PowerShell for Windows compatibility
  provisioner "local-exec" {
    interpreter = ["PowerShell", "-Command"]
    command = <<-EOT
      $dist = "${local.dist_dir}"
      if (-not (Test-Path $dist)) {
        Write-Output "dist folder not found. Skipping upload."
        exit 0
      }
      
      $json = '{ "apiBaseUrl": "/api" }'
      Set-Content -Path "$dist/config.json" -Value $json
      
      aws s3 sync "$dist" "s3://${var.site_bucket_name}/" --delete
    EOT
  }
}

############################
# CloudFront OAC
############################
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for private S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

############################
# CloudFront
############################
resource "aws_cloudfront_distribution" "cdn" {
  depends_on = [
    aws_lb.alb,
    null_resource.upload_frontend_and_config
  ]

  enabled            = true
  # MODIFIED: Enable IPv6
  is_ipv6_enabled = true
  comment            = "${var.project_name}-cdn"

  origin {
    domain_name              = "${var.site_bucket_name}.s3.${var.aws_region}.amazonaws.com"
    origin_id                = "s3-private"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  origin {
    domain_name = aws_lb.alb.dns_name
    origin_id   = "alb-api"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Origin-Verify"
      value = random_password.alb_secret.result
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id       = "s3-private"
    viewer_protocol_policy = "allow-all" 
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      cookies { forward = "none" }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "alb-api"
    viewer_protocol_policy = "allow-all" 
    allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies { forward = "all" }
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

############################
# S3 Bucket Policy
############################
data "aws_iam_policy_document" "site_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontReadOnly"
    effect = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      "arn:aws:s3:::${var.site_bucket_name}/*"
    ]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = var.site_bucket_name
  policy = data.aws_iam_policy_document.site_bucket_policy.json
}

############################
# CloudTrail
############################
data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "cloudtrail_bucket_policy" {
  statement {
    sid    = "AWSCloudTrailAclCheck"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudtrail.amazonaws.com"]
    }
    actions   = ["s3:GetBucketAcl"]
    resources = ["arn:aws:s3:::${var.cloudtrail_bucket_name}"]
  }

  statement {
    sid    = "AWSCloudTrailWrite"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudtrail.amazonaws.com"]
    }
    actions   = ["s3:PutObject"]
    resources = [
      "arn:aws:s3:::${var.cloudtrail_bucket_name}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "s3:x-amz-acl"
      values   = ["bucket-owner-full-control"]
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_policy" {
  bucket = var.cloudtrail_bucket_name
  policy = data.aws_iam_policy_document.cloudtrail_bucket_policy.json
}

resource "aws_cloudtrail" "main" {
  name             = "usis-trail"
  s3_bucket_name = var.cloudtrail_bucket_name

  enable_log_file_validation    = true
  kms_key_id                    = "" 
  is_multi_region_trail         = false
  include_global_service_events = true 

  event_selector {
    read_write_type           = "All"
    include_management_events = true
  }

  depends_on = [aws_s3_bucket_policy.cloudtrail_policy]
}

############################
# CloudWatch Alarms
############################
resource "aws_cloudwatch_metric_alarm" "alb_healthy_hosts" {
  alarm_name          = "ALB-HealthyHostCount-Low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Minimum"
  threshold           = 2
  alarm_description   = "Trigger when backend healthy hosts drops below 2"
  actions_enabled     = false

  dimensions = {
    TargetGroup  = aws_lb_target_group.backend_tg.arn_suffix
    LoadBalancer = aws_lb.alb.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "ec2_cpu_backend_1" {
  alarm_name          = "EC2-backend-1-CPU-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 70
  alarm_description   = "Trigger when CPU > 70%"
  actions_enabled     = false

  dimensions = {
    InstanceId = aws_instance.backend_1.id
  }
}

resource "aws_cloudwatch_metric_alarm" "ec2_cpu_backend_2" {
  alarm_name          = "EC2-backend-2-CPU-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 70
  alarm_description   = "Trigger when CPU > 70%"
  actions_enabled     = false

  dimensions = {
    InstanceId = aws_instance.backend_2.id
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_cpu_high" {
  alarm_name          = "RDS-CPU-High"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 70
  alarm_description   = "Trigger when RDS CPU > 70%"
  actions_enabled     = false

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.mysql.identifier
  }
}