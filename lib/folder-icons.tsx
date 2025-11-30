import {
  Bot,
  Code,
  Cloud,
  Database,
  GitBranch,
  Container,
  Layers,
  Settings,
  FileCode,
  Cpu,
  Network,
  Shield,
  Terminal,
  TestTube,
  Rocket,
  Puzzle,
  Palette,
  FolderKanban,
  Lightbulb,
  Server,
  Workflow,
  Globe,
  Lock,
  Zap,
  BookOpen,
  Wrench,
  Monitor,
  Smartphone,
  BarChart,
  Key,
  Package,
  MessageSquare,
  Search,
  FileJson,
  Folder,
  type LucideIcon,
} from "lucide-react"

// Mapping folder names to icons
// Easy to customize - just add or modify entries
export const folderIconMap: Record<string, LucideIcon> = {
  // AI & Agents
  "ai-agents": Bot,
  "autodev": Cpu,
  "autogpt": Bot,
  "babyagi": Bot,
  "copilot": Code,
  "crewai": Bot,
  "cursor": Code,
  "langchain": Workflow,
  "localllm": Cpu,
  "semantic-kernel": Puzzle,
  "gpt4all": Bot,
  "jan": Bot,
  "llama-cpp": Cpu,
  "lm-studio": Bot,
  "localai": Cpu,
  "ollama": Bot,
  "text-generation-webui": Terminal,

  // API
  "api": Globe,
  "api-design": FileCode,
  "api-documentation": BookOpen,
  "api-frameworks": Layers,
  "api-management": Settings,
  "api-security": Shield,
  "api-testing": TestTube,
  "graphql": Zap,
  "microservices": Network,
  "rest-apis": Globe,
  "resource-modeling": FileJson,
  "url-design": Globe,
  "federation": Network,
  "resolvers": Puzzle,
  "schema-design": FileCode,
  "subscriptions": MessageSquare,
  "content-negotiation": FileJson,
  "http-methods": Globe,

  // AWS
  "aws": Cloud,
  "compute": Server,
  "containers": Container,
  "devtools": Wrench,
  "messaging": MessageSquare,
  "monitoring": BarChart,
  "networking": Network,
  "sdk": Package,
  "security": Shield,
  "serverless": Zap,
  "storage": Database,

  // Databases
  "databases": Database,
  "dynamodb": Database,
  "mongodb": Database,
  "mssql": Database,
  "postgresql": Database,

  // DevOps
  "devops": Rocket,
  "github": GitBranch,
  "gitlab": GitBranch,

  // Docker
  "docker": Container,

  // .NET
  "dotnet": Code,
  "architecture": Layers,
  "azure": Cloud,
  "data-access": Database,
  "deployment": Rocket,
  "desktop": Monitor,
  "distributed": Network,
  "fundamentals": BookOpen,
  "get-started": Lightbulb,
  "language": FileCode,
  "machine-learning": Cpu,
  "mobile": Smartphone,
  "performance": Zap,
  "platforms": Layers,
  "runtime": Cpu,
  "testing": TestTube,
  "tools": Wrench,
  "web": Globe,

  // Frameworks
  "frameworks": Puzzle,

  // Obsidian
  "obsidian": BookOpen,
  "plugins": Puzzle,
  "themes": Palette,

  // Pet Projects
  "pet-projects": FolderKanban,
  "avro-auth": Key,
  "avro-autokit": Wrench,
  "avro-autosql": Database,
  "avro-cli": Terminal,
  "avro-cron": Workflow,
  "avro-docs": BookOpen,
  "avro-domain": Globe,
  "avro-fe": Monitor,
  "avro-install": Package,
  "avro-kb": BookOpen,
  "avro-mcp": Network,
  "avro-roadmap": FolderKanban,
  "avro-vscode": Code,
  "avro.cc": Globe,

  // Programming Languages
  "programming-langs": FileCode,
  "csharp": Code,
  "golang": Code,
  "javascript": FileCode,
  "python": FileCode,
  "rust": Code,
  "typescript": FileCode,

  // Software
  "software-architecture": Layers,
  "software-design": Puzzle,
  "computer-science": Cpu,
}

// Get icon for a folder, with fallback to default Folder icon
export function getFolderIcon(folderName: string): LucideIcon {
  const normalizedName = folderName.toLowerCase().replace(/\s+/g, "-")
  return folderIconMap[normalizedName] || Folder
}

// Get all available icons for reference
export function getAvailableIcons(): string[] {
  return Object.keys(folderIconMap)
}
