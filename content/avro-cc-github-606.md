---
tags:
	- avro-cc
	- knowledge-graph
	- education-bridge
---

# avro.cc GitHub 606 Hub

This hub bridges the shipping-focused `avro-cc` work with the deeper study tracks that live under `[[./education/education-moc|Education]]`. Each topic lists the active delivery lane plus its paired learning map so Quartz prerender keeps the context stitched together.

## Topic bridges

- **AI & Agents** → `[[./avro-cc-github-606/ai-agents/index|Ai-Agents Lane]]` · `[[./education/ai/ai-moc|Ai Moc]]`
- **API Lifecycle** → `[[./avro-cc-github-606/api/index|Api Delivery]]` · `[[./education/api/api-moc|Api Moc]]`
- **AWS Platform** → `[[./avro-cc-github-606/aws/index|Aws Backlog]]` · `[[./education/aws/aws-moc|Aws Moc]]`
- **DevOps Systems** → `[[./avro-cc-github-606/devops/index|Devops Runway]]` · `[[./education/devops/devops-moc|Devops Moc]]`
- **.NET & Frameworks** → `[[./avro-cc-github-606/dotnet/index|.Net Focus]]` · `[[./education/dotnet/dotnet-moc|.Net Moc]]`
- **Programming Languages** → `[[./avro-cc-github-606/programming-langs/index|Language Experiments]]` · `[[./education/python/python-moc|Python]]` · `[[./education/typescript/typescript-moc|Typescript]]`

## Cross-relations

- AI work often consumes API surfaces and cloud runtimes, so link sprint notes back to `[[./avro-cc-github-606/api/index]]` and `[[./avro-cc-github-606/aws/index]]` for shared decisions.
- Platform pieces (AWS, DevOps) inherit design constraints from the `.NET` lane—reference `[[./education/software-architecture/software-architecture-moc|Architecture Studies]]` when capturing trade-offs.
- Programming-language spikes should cite their educational roots (Python, TypeScript, etc.) to keep reusable tutorials discoverable from product notes.

## Tagging guidance

Use `#education` when a page mirrors material from the study vault, `#delivery-lane` for execution notes, and `#crosslink` where two or more topic bridges meet. This keeps the Quartz graph legible when prerendered.
