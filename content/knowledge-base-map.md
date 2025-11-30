---
title: Knowledge Base Map
aliases:
  - Knowledge-Base-Map
  - KB-Map
  - Complete-Index
publish: true
enableToc: true
tags:
  - moc
  - index
  - knowledge-base
---

# 🗺️ Avro.CC Knowledge Base Map

> Повна карта знань з усіма категоріями та зв'язками між ними.
> *Оновлено: 2025-11-29*

---

## 📊 Статистика
- **Загальна кількість індексних файлів:** ~5683
- **Основних категорій:** 15
- **Підкатегорій:** 100+

---

<details>
<summary><h2>🤖 AI Agents</h2></summary>

### Опис
Фреймворки та інструменти для роботи з AI агентами.

### Підкатегорії
- [[./ai-agents/autodev/index|AutoDev]] - Автоматизація розробки з AI
- [[./ai-agents/autogpt/index|AutoGPT]] - Автономний GPT агент
- [[./ai-agents/babyagi/index|BabyAGI]] - Простий AI агент для задач
- [[./ai-agents/copilot/index|GitHub Copilot]] - AI асистент для коду
- [[./ai-agents/crewai/index|CrewAI]] - Мультиагентний фреймворк
- [[./ai-agents/cursor/index|Cursor]] - AI-powered IDE
- [[./ai-agents/langchain/index|LangChain]] - Фреймворк для LLM додатків
- [[./ai-agents/semantic-kernel/index|Semantic Kernel]] - Microsoft AI SDK

<details>
<summary><h4>🖥️ Local LLM Tools</h4></summary>

Безкоштовні локальні LLM інструменти:
- [[./ai-agents/localllm/ollama/index|Ollama]] - Локальний LLM runner
- [[./ai-agents/localllm/lm-studio/index|LM Studio]] - Desktop app для локальних LLM
- [[./ai-agents/localllm/jan/index|Jan]] - Open-source ChatGPT альтернатива
- [[./ai-agents/localllm/gpt4all/index|GPT4All]] - Приватний локальний чатбот
- [[./ai-agents/localllm/localai/index|LocalAI]] - OpenAI-сумісний API
- [[./ai-agents/localllm/llama-cpp/index|llama.cpp]] - C++ імплементація Llama
- [[./ai-agents/localllm/text-generation-webui/index|Text Generation WebUI]] - Веб інтерфейс для LLM

</details>

### Зв'язки
- 🔗 [[./dotnet/index|.NET]] → Semantic Kernel, AI інтеграція
- 🔗 [[./programming-langs/python/index|Python]] → LangChain, AutoGPT
- 🔗 [[./api/index|API]] → LLM API інтеграція

</details>

---

<details>
<summary><h2>🔌 API</h2></summary>

### Опис
Все про розробку, дизайн та управління API.

### Підкатегорії

<details>
<summary><h4>REST APIs</h4></summary>

- [[./api/rest-apis/index|REST APIs Overview]]
- [[./api/rest-apis/http-methods/index|HTTP Methods]] - GET, POST, PUT, DELETE, PATCH
- [[./api/rest-apis/status-codes/index|HTTP Status Codes]] - 1xx-5xx коди відповідей
- [[./api/rest-apis/content-negotiation/index|Content Negotiation]] - Media types, headers
- [[./api/rest-apis/hypermedia/index|Hypermedia/HATEOAS]] - HAL, JSON API, Siren

</details>

<details>
<summary><h4>GraphQL</h4></summary>

- [[./api/graphql/index|GraphQL Overview]]
- [[./api/graphql/schema-design/index|Schema Design]] - Types, fields, relationships
- [[./api/graphql/resolvers/index|Resolvers]] - Data fetching
- [[./api/graphql/subscriptions/index|Subscriptions]] - Real-time updates
- [[./api/graphql/federation/index|Federation]] - Distributed schemas

</details>

<details>
<summary><h4>API Design & Management</h4></summary>

- [[./api/api-design/index|API Design]] - Принципи проектування
  - [[./api/api-design/resource-modeling/index|Resource Modeling]]
  - [[./api/api-design/url-design/index|URL Design]]
- [[./api/api-documentation/index|API Documentation]] - OpenAPI/Swagger
- [[./api/api-security/index|API Security]] - Auth, OAuth, JWT
- [[./api/api-testing/index|API Testing]] - Unit, Integration, Contract
- [[./api/api-management/index|API Management]] - Gateways, Rate limiting
- [[./api/api-frameworks/index|API Frameworks]] - Інструменти

</details>

- [[./api/microservices/index|Microservices APIs]] - Мікросервісна архітектура

### Зв'язки
- 🔗 [[./dotnet/web/index|.NET Web]] → ASP.NET Core APIs
- 🔗 [[./aws/index|AWS]] → API Gateway, Lambda
- 🔗 [[./databases/index|Databases]] → Data Layer
- 🔗 [[./testing/index|Testing]] → API Testing

</details>

---

<details>
<summary><h2>☁️ AWS</h2></summary>

### Опис
Amazon Web Services для .NET розробки.

### Підкатегорії

<details>
<summary><h4>Compute</h4></summary>

- [[./aws/compute/index|Compute Services]]
- [[./aws/compute/ec2/index|EC2]] - Virtual servers
- [[./aws/compute/lambda/index|Lambda]] - Serverless functions
- [[./aws/compute/ecs/index|ECS]] - Container service
- [[./aws/compute/eks/index|EKS]] - Kubernetes

</details>

<details>
<summary><h4>Containers</h4></summary>

- [[./aws/containers/index|Container Services]]
- [[./aws/containers/ecs/index|ECS]]
- [[./aws/containers/eks/index|EKS]]
- [[./aws/containers/fargate/index|Fargate]]

</details>

<details>
<summary><h4>Storage & Databases</h4></summary>

- [[./aws/storage/index|Storage Services]] - S3, DynamoDB, RDS

</details>

<details>
<summary><h4>Development & DevOps</h4></summary>

- [[./aws/devtools/index|Development Tools]]
  - [[./aws/devtools/cloudformation/index|CloudFormation]]
  - [[./aws/devtools/codebuild/index|CodeBuild]]
  - [[./aws/devtools/codedeploy/index|CodeDeploy]]
  - [[./aws/devtools/codepipeline/index|CodePipeline]]

</details>

<details>
<summary><h4>Other Services</h4></summary>

- [[./aws/networking/index|Networking]] - VPC, CloudFront, Route 53
- [[./aws/security/index|Security & Identity]] - IAM, Cognito, KMS
- [[./aws/messaging/index|Messaging]] - SQS, SNS, EventBridge
- [[./aws/monitoring/index|Monitoring]] - CloudWatch, X-Ray
- [[./aws/serverless/index|Serverless]] - Lambda, API Gateway
- [[./aws/sdk/index|AWS SDK for .NET]]

</details>

### Зв'язки
- 🔗 [[./dotnet/index|.NET]] → AWS SDK, Lambda functions
- 🔗 [[./docker/index|Docker]] → ECS, EKS
- 🔗 [[./devops/index|DevOps]] → CodePipeline, CodeBuild
- 🔗 [[./databases/dynamodb/index|DynamoDB]] → NoSQL storage

</details>

---

<details>
<summary><h2>💻 Computer Science</h2></summary>

### Опис
Фундаментальні концепції комп'ютерних наук.

### Зв'язки
- 🔗 [[./programming-langs/index|Programming Languages]] → Алгоритми, структури даних
- 🔗 [[./software-architecture/index|Software Architecture]] → Теорія систем
- 🔗 [[./software-design/index|Software Design]] → Патерни проектування

</details>

---

<details>
<summary><h2>🗄️ Databases</h2></summary>

### Опис
Системи керування базами даних.

### Підкатегорії
- [[./databases/postgresql/index|PostgreSQL]] - Open-source RDBMS
- [[./databases/mssql/index|MS SQL Server]] - Microsoft SQL Server
- [[./databases/mongodb/index|MongoDB]] - Document NoSQL DB
- [[./databases/dynamodb/index|DynamoDB]] - AWS NoSQL DB

### Зв'язки
- 🔗 [[./dotnet/data-access/index|.NET Data Access]] → EF Core, ADO.NET
- 🔗 [[./api/index|API]] → Data Layer
- 🔗 [[./aws/storage/index|AWS Storage]] → DynamoDB, RDS
- 🔗 [[./docker/index|Docker]] → Database containers

</details>

---

<details>
<summary><h2>🔧 DevOps</h2></summary>

### Опис
DevOps практики та інструменти.

### Підкатегорії
- [[./devops/github/index|GitHub]] - Git hosting, Actions, CI/CD
- [[./devops/gitlab/index|GitLab]] - DevOps platform

### Зв'язки
- 🔗 [[./docker/index|Docker]] → Containerization
- 🔗 [[./aws/devtools/index|AWS DevTools]] → Cloud CI/CD
- 🔗 [[./dotnet/deployment/index|.NET Deployment]] → Release pipelines
- 🔗 [[./testing/index|Testing]] → Automated testing

</details>

---

<details>
<summary><h2>🐳 Docker</h2></summary>

### Опис
Контейнеризація та Docker.

### Зв'язки
- 🔗 [[./devops/index|DevOps]] → CI/CD pipelines
- 🔗 [[./aws/containers/index|AWS Containers]] → ECS, EKS, Fargate
- 🔗 [[./dotnet/deployment/index|.NET Deployment]] → Container deployment
- 🔗 [[./databases/index|Databases]] → Database containers

</details>

---

<details>
<summary><h2>🟣 .NET</h2></summary>

### Опис
Повний стек .NET розробки.

### Підкатегорії

<details>
<summary><h4>Core Stacks</h4></summary>

- [[./dotnet/get-started/index|Get Started]] - Початок роботи
- [[./dotnet/fundamentals/index|Fundamentals]] - Основи .NET
  - Core Concepts
  - Language Fundamentals
  - Memory Management
  - Threading & Concurrency
  - Configuration & Settings
  - CI/CD Fundamentals

</details>

<details>
<summary><h4>Data & Architecture</h4></summary>

- [[./dotnet/data-access/index|Data Access]]
  - [[./dotnet/data-access/ef-core/index|Entity Framework Core]]
  - [[./dotnet/data-access/orm/index|ORMs]]
  - [[./dotnet/data-access/micro-orm/index|Micro ORMs]]
  - [[./dotnet/data-access/ado-net/index|ADO.NET]]
  - [[./dotnet/data-access/no-sql/index|NoSQL]]
- [[./dotnet/architecture/index|Architecture]]
  - [[./dotnet/architecture/patterns/index|Architecture Patterns]]
  - [[./dotnet/architecture/microservices/index|Microservices]]
  - [[./dotnet/architecture/ddd/index|Domain-Driven Design]]
  - [[./dotnet/architecture/event-driven/index|Event-Driven]]
  - [[./dotnet/architecture/cloud-native/index|Cloud-Native]]

</details>

<details>
<summary><h4>Web Development</h4></summary>

- [[./dotnet/web/index|Web Stack]]
  - [[./dotnet/web/blazor/index|Blazor]]
  - [[./dotnet/web/asp-net-core/index|ASP.NET Core]]
  - [[./dotnet/web/signalr/index|SignalR]]

</details>

<details>
<summary><h4>Platform Stacks</h4></summary>

- [[./dotnet/desktop/index|Desktop]] - WPF, WinForms
- [[./dotnet/mobile/index|Mobile]] - MAUI, Xamarin
- [[./dotnet/platforms/index|Platforms]]

</details>

<details>
<summary><h4>Quality & Performance</h4></summary>

- [[./dotnet/testing/index|Testing]]
- [[./dotnet/performance/index|Performance]]
- [[./dotnet/monitoring/index|Monitoring]]
- [[./dotnet/security/index|Security]]

</details>

<details>
<summary><h4>Infrastructure</h4></summary>

- [[./dotnet/deployment/index|Deployment]]
- [[./dotnet/runtime/index|Runtime]]
- [[./dotnet/tools/index|Tools]]
- [[./dotnet/language/index|Language Features]]
- [[./dotnet/distributed/index|Distributed Systems]]
- [[./dotnet/machine-learning/index|Machine Learning]]
- [[./dotnet/azure/index|Azure Integration]]

</details>

### Зв'язки
- 🔗 [[./programming-langs/csharp/index|C#]] → Мова програмування
- 🔗 [[./databases/index|Databases]] → Data Access
- 🔗 [[./api/index|API]] → Web APIs
- 🔗 [[./aws/dotnet/index|AWS .NET]] → Cloud deployment
- 🔗 [[./docker/index|Docker]] → Containerization
- 🔗 [[./ai-agents/semantic-kernel/index|Semantic Kernel]] → AI integration

</details>

---

<details>
<summary><h2>📚 Frameworks</h2></summary>

### Опис
Фреймворки та бібліотеки.

### Зв'язки
- 🔗 [[./dotnet/index|.NET]] → .NET frameworks
- 🔗 [[./programming-langs/index|Programming Languages]] → Language frameworks
- 🔗 [[./api/api-frameworks/index|API Frameworks]]

</details>

---

<details>
<summary><h2>📝 Obsidian</h2></summary>

### Опис
Obsidian плагіни та теми.

### Підкатегорії
- [[./obsidian/plugins/index|Plugins]]
- [[./obsidian/themes/index|Themes]]

</details>

---

<details>
<summary><h2>🚀 Pet Projects</h2></summary>

### Опис
Персональні проекти.

### Підкатегорії
- [[./pet-projects/avro-auth/index|Avro-Auth]] - Автентифікація
- [[./pet-projects/avro-autokit/index|Avro-Autokit]] - Automation toolkit
- [[./pet-projects/avro-autosql/index|Avro-Autosql]] - SQL automation
- [[./pet-projects/avro-cli/index|Avro-CLI]] - Command line tools
- [[./pet-projects/avro-cron/index|Avro-Cron]] - Scheduled tasks
- [[./pet-projects/avro-docs/index|Avro-Docs]] - Documentation
- [[./pet-projects/avro-domain/index|Avro-Domain]] - Domain management
- [[./pet-projects/avro-fe/index|Avro-FE]] - Frontend
- [[./pet-projects/avro-install/index|Avro-Install]] - Installation tools
- [[./pet-projects/avro-kb/index|Avro-KB]] - Knowledge base
- [[./pet-projects/avro-mcp/index|Avro-MCP]] - MCP server
- [[./pet-projects/avro-roadmap/index|Avro-Roadmap]] - Project roadmap
- [[./pet-projects/avro-vscode/index|Avro-VSCode]] - VS Code extension
- [[./pet-projects/avro.cc/index|Avro.CC]] - Main website

### Зв'язки
- 🔗 [[./dotnet/index|.NET]] → Backend services
- 🔗 [[./api/index|API]] → REST/GraphQL APIs
- 🔗 [[./devops/index|DevOps]] → CI/CD

</details>

---

<details>
<summary><h2>💬 Programming Languages</h2></summary>

### Опис
Мови програмування.

### Підкатегорії
- [[./programming-langs/csharp/index|C#]] - Основна мова .NET
- [[./programming-langs/javascript/index|JavaScript]] - Web development
- [[./programming-langs/typescript/index|TypeScript]] - Typed JavaScript
- [[./programming-langs/python/index|Python]] - Scripting, AI/ML
- [[./programming-langs/golang/index|Go]] - Systems programming
- [[./programming-langs/rust/index|Rust]] - Safe systems programming

### Зв'язки
- 🔗 [[./dotnet/index|.NET]] → C#
- 🔗 [[./ai-agents/index|AI Agents]] → Python, TypeScript
- 🔗 [[./api/index|API]] → Всі мови

</details>

---

<details>
<summary><h2>🏗️ Software Architecture</h2></summary>

### Опис
Архітектура програмного забезпечення.

### Зв'язки
- 🔗 [[./dotnet/architecture/index|.NET Architecture]] → Patterns, DDD
- 🔗 [[./software-design/index|Software Design]] → Design patterns
- 🔗 [[./api/microservices/index|Microservices]] → Distributed architecture
- 🔗 [[./computer-science/index|Computer Science]] → Theory

</details>

---

<details>
<summary><h2>🎨 Software Design</h2></summary>

### Опис
Патерни та принципи проектування.

### Зв'язки
- 🔗 [[./software-architecture/index|Software Architecture]] → Architecture patterns
- 🔗 [[./dotnet/fundamentals/design-patterns/index|.NET Design Patterns]]
- 🔗 [[./computer-science/index|Computer Science]] → Theory

</details>

---

<details>
<summary><h2>🧪 Testing</h2></summary>

### Опис
Тестування програмного забезпечення.

### Зв'язки
- 🔗 [[./dotnet/testing/index|.NET Testing]] → Unit, Integration tests
- 🔗 [[./api/api-testing/index|API Testing]] → Contract, E2E tests
- 🔗 [[./devops/index|DevOps]] → Automated testing

</details>

---

## 🔗 Relationship Matrix

| Категорія | Пов'язано з |
|-----------|-------------|
| **AI Agents** | .NET, Python, API |
| **API** | .NET Web, AWS, Databases, Testing |
| **AWS** | .NET, Docker, DevOps, Databases |
| **Databases** | .NET Data Access, API, AWS, Docker |
| **DevOps** | Docker, AWS, .NET, Testing |
| **Docker** | DevOps, AWS, .NET, Databases |
| **.NET** | C#, Databases, API, AWS, Docker, AI |
| **Programming Languages** | .NET, AI Agents, API |
| **Software Architecture** | .NET, Design, CS |
| **Software Design** | Architecture, .NET, CS |
| **Testing** | .NET, API, DevOps |

---

## 🏷️ Quick Navigation Tags

```
#moc #dotnet #api #aws #databases #devops #docker 
#ai-agents #programming-langs #testing #architecture
```
