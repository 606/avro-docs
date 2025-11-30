---
glossary: true
title: CI/CD
definition: "Continuous Integration / Continuous Deployment - build and deploy automation"
aliases:
  - CI/CD
  - cicd
  - continuous integration
  - continuous deployment
  - continuous delivery
publish: true
tags:
  - glossary
  - devops
  - automation
---

# CI/CD

**CI/CD** is the practice of automating code integration and application delivery processes.

## Continuous Integration (CI)

Automatic build and testing on every commit:

1. Developer pushes code
2. Build is triggered
3. Tests are executed
4. Report is generated

## Continuous Deployment (CD)

Automatic deployment after successful CI:

1. Build artifacts
2. Deploy to staging
3. Run automated tests
4. Deploy to production

## Tools

| Tool | Description |
|------|-------------|
| GitHub Actions | CI/CD from GitHub |
| GitLab CI | Built into GitLab |
| Jenkins | Self-hosted, flexible |
| CircleCI | Cloud-based |
| Azure DevOps | Microsoft ecosystem |

## Приклад GitHub Actions

```yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install & Test
        run: |
          npm ci
          npm test
          
      - name: Build
        run: npm run build
        
      - name: Deploy
        run: npm run deploy
```
