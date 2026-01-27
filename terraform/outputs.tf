output "cloudfront_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "s3_website_endpoint" {
  value = "http://${var.site_bucket_name}.s3-website-${var.aws_region}.amazonaws.com"
}