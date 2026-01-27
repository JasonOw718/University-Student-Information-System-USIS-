############################
# VPC
############################
resource "aws_vpc" "this" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = "${var.project_name}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project_name}-igw" }
}

############################
# Subnets (2 public + 4 private)
############################
# Public (ALB + Bastion)
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-public-1a" }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-public-1b" }
}

# Private APP (Backend EC2)
resource "aws_subnet" "private_app_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "us-east-1a"
  tags              = { Name = "${var.project_name}-private-app-1a" }
}

resource "aws_subnet" "private_app_b" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "us-east-1b"
  tags              = { Name = "${var.project_name}-private-app-1b" }
}

# Private DB (RDS subnet group selects these 2)
resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "us-east-1a"
  tags              = { Name = "${var.project_name}-private-db-1a" }
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.22.0/24"
  availability_zone = "us-east-1b"
  tags              = { Name = "${var.project_name}-private-db-1b" }
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

resource "aws_route_table_association" "public_a_assoc" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_b_assoc" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public_rt.id
}

# NAT Gateway (one AZ only, in public_a)
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

# Private RT -> NAT
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
resource "aws_security_group" "alb_sg" {
  name   = "${var.project_name}-alb-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-alb-sg" }
}

resource "aws_security_group" "bastion_sg" {
  name   = "${var.project_name}-bastion-sg"
  vpc_id = aws_vpc.this.id

  ingress {
    description = "SSH to bastion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    description = "All egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-bastion-sg" }
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

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    description = "All egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
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
    description = "All egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-rds-sg" }
}

############################
# RDS Subnet Group + MySQL (Single AZ)
############################
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = [aws_subnet.private_db_a.id, aws_subnet.private_db_b.id]
  tags       = { Name = "${var.project_name}-rds-subnet-group" }
}

resource "aws_db_instance" "mysql" {
  identifier        = "${var.project_name}-mysql"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"

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

############################
# EC2: Bastion + Backend-1/2 (user_data bootstrap)
############################
locals {
  # For typical Spring Boot with MySQL
  jdbc_url = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/${var.db_name}"
  
  dist_dir = "${path.module}/../frontend/dist"

  backend_user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    yum update -y

    # Install Docker
    amazon-linux-extras install docker -y || yum install -y docker
    systemctl enable docker
    systemctl start docker

    # Pull and run backend
    docker pull ${var.backend_container_image} || true
    docker rm -f backend || true

    docker run -d --name backend \
      -p 8080:8080 \
      -e SPRING_DATASOURCE_URL='${local.jdbc_url}' \
      -e SPRING_DATASOURCE_USERNAME='${var.db_username}' \
      -e SPRING_DATASOURCE_PASSWORD='${var.db_password}' \
      ${var.backend_container_image}
  EOF
}

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.al2.id
  instance_type               = "t3.small"
  subnet_id                   = aws_subnet.public_a.id
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = { Name = "${var.project_name}-bastion" }
}

resource "aws_instance" "backend_1" {
  ami                    = data.aws_ami.al2.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.private_app_a.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name               = var.key_name
  user_data              = local.backend_user_data

  tags = { Name = "backend-1" }
}

resource "aws_instance" "backend_2" {
  ami                    = data.aws_ami.al2.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.private_app_b.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name               = var.key_name
  user_data              = local.backend_user_data

  tags = { Name = "backend-2" }
}

############################
# ALB -> Target Group (8080) -> backend instances
############################
resource "aws_lb" "alb" {
  name               = "${var.project_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = { Name = "${var.project_name}-alb" }
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

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}
############################
# S3 Static Website + Runtime config.json (contains ALB URL)
############################

############################
# S3 Static Website + Runtime config.json (contains ALB URL)
# WORKAROUND: Use local-exec to bypass AWS Provider S3 Object Lock checks
############################

resource "null_resource" "s3_website_setup" {
  # Make it rerun if bucket name changes
  triggers = {
    bucket = var.site_bucket_name
  }

  provisioner "local-exec" {
    command = <<-EOT
      set -e

      # 1) Enable static website hosting
      aws s3api put-bucket-website --bucket "${var.site_bucket_name}" --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "error.html"}
      }'

      # 2) Disable block public access (so policy works)
      aws s3api put-public-access-block --bucket "${var.site_bucket_name}" --public-access-block-configuration '{
        "BlockPublicAcls": false,
        "IgnorePublicAcls": false,
        "BlockPublicPolicy": false,
        "RestrictPublicBuckets": false
      }'

      # 3) Apply public read policy
      aws s3api put-bucket-policy --bucket "${var.site_bucket_name}" --policy '{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${var.site_bucket_name}/*"
          }
        ]
      }'
    EOT
  }
}

resource "null_resource" "upload_frontend_and_config" {
  depends_on = [
    aws_lb.alb,
    null_resource.s3_website_setup
  ]

  # Re-run upload when ALB DNS changes (or dist changes if you change this trigger later)
  triggers = {
    alb_dns = aws_lb.alb.dns_name
  }

  provisioner "local-exec" {
    command = <<-EOT
      set -e

      # Create config.json locally (runtime config)
      cat > "${path.module}/config.json" <<EOF
      {
        "apiBaseUrl": "http://${aws_lb.alb.dns_name}/api"
      }
EOF

      # Upload config.json to S3 root
      aws s3 cp "${path.module}/config.json" "s3://${var.site_bucket_name}/config.json" --content-type "application/json"

      # Upload your dist folder (Vite) - assumes it exists
      aws s3 sync "${local.dist_dir}" "s3://${var.site_bucket_name}/" --delete
    EOT
  }
}
