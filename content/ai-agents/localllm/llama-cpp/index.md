---
title: Llama.Cpp
parent: "[[./localllm/index]]"
aliases:
  - Llama-Cpp
  - Llama.Cpp
  - Llama.Cpp
publish: true
enableToc: true
tags:
  - ai-agents
  - localllm
  - llama-cpp
  - local-llm
---

## Overview

Llama.cpp is a C/C++ implementation for running Llama models locally, providing high-performance inference on CPU and GPU.

## Key Features

- **High Performance**: Optimized C/C++ implementation
- **CPU/GPU Support**: Runs on CPU or with GPU acceleration
- **Multiple Platforms**: Windows, macOS, Linux, even mobile
- **Model Formats**: GGML and GGUF format support
- **Quantization**: Various quantization levels for different hardware

## Installation

### Pre-built Binaries
Download from [releases](https://github.com/ggerganov/llama.cpp/releases)

### Build from Source
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
```

## Usage

### Basic Chat
```bash
./main -m models/llama-7b.gguf --prompt "Hello, how are you?"
```

### Interactive Mode
```bash
./main -m models/llama-7b.gguf -i
```

### Server Mode
```bash
./server -m models/llama-7b.gguf
```

## Supported Models

- Llama 2/3 series
- Code Llama
- Other Llama-compatible models in GGUF format

## Related
- [[./localllm/index|Local Llm Tools]]
- [[./ai-agents|Ai Agents]]
