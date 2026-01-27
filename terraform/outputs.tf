output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.mysql.address
}

output "s3_bucket_name" {
  value = var.site_bucket_name
}

# Website endpoint 
output "s3_website_endpoint" {
  value = "http://${var.site_bucket_name}.s3-website-${var.aws_region}.amazonaws.com"
}
