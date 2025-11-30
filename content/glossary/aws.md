---
glossary: true
title: AWS
definition: "Amazon Web Services - cloud platform from Amazon"
aliases:
  - AWS
  - aws
  - Amazon Web Services
publish: true
tags:
  - glossary
  - cloud
  - amazon
---

# AWS

**AWS** (Amazon Web Services) is the world's largest cloud platform with over 200 services.

## Core Services

### Compute
- **EC2** — virtual servers
- **Lambda** — serverless functions
- **ECS/EKS** — containers

### Storage
- **S3** — object storage
- **EBS** — block storage
- **EFS** — file system

### Database
- **RDS** — relational databases
- **DynamoDB** — NoSQL
- **ElastiCache** — caching

### Networking
- **VPC** — virtual network
- **Route 53** — DNS
- **CloudFront** — CDN

## Lambda Example

```python
import json

def lambda_handler(event, context):
    name = event.get('name', 'World')
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello, {name}!')
    }
```

## AWS CLI

```bash
# Конфігурація
aws configure

# S3
aws s3 ls
aws s3 cp file.txt s3://bucket/

# EC2
aws ec2 describe-instances

# Lambda
aws lambda invoke --function-name my-func output.json
```
