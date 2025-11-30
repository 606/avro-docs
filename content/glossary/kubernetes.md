---
glossary: true
title: Kubernetes
definition: "Container orchestration platform"
aliases:
  - kubernetes
  - K8s
  - k8s
publish: true
tags:
  - glossary
  - devops
  - containers
  - orchestration
---

# Kubernetes

**Kubernetes** (K8s) is an open-source platform for automating deployment, scaling, and management of containerized applications.

## Core Components

### Control Plane
- **API Server** — entry point for all REST commands
- **etcd** — distributed configuration storage
- **Scheduler** — distributes Pods across nodes
- **Controller Manager** — manages controllers

### Worker Nodes
- **Kubelet** — agent on each node
- **Container Runtime** — Docker, containerd
- **Kube-proxy** — network proxy

## Core Objects

```yaml
# Pod - smallest deployment unit
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:1.0
    ports:
    - containerPort: 8080
```

```yaml
# Deployment - керує ReplicaSet
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
```

## Useful Commands

```bash
# Cluster status
kubectl cluster-info

# View pods
kubectl get pods

# Deploy
kubectl apply -f deployment.yaml

# Logs
kubectl logs pod-name

# Shell into pod
kubectl exec -it pod-name -- /bin/sh
```
