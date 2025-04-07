# Intent MCP Kit 🚀

<div align="center">

[![npm version](https://img.shields.io/npm/v/@intent-mcp/kit.svg?style=flat)](https://www.npmjs.com/package/@intent-mcp/kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/openpandacodes/intent-mcp-kit/pulls)

</div>

<p align="center">
  <strong>A powerful SDK for Machine Comprehension and Processing (MCP) with seamless UI integration.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#widgets">Widgets</a> •
  <a href="#api">API</a> •
  <a href="#examples">Examples</a> •
  <a href="#documentation">Documentation</a>
</p>

## Features ✨

- 🎯 **Intent Processing**: Advanced natural language understanding and intent classification
- 🔄 **Workflow Generation**: Automated workflow creation from natural language inputs
- 🎨 **Interactive Widgets**: Ready-to-use UI components for chat and flow visualization
- 🛠️ **Extensible Architecture**: Easy to customize and extend with your own components
- 📦 **TypeScript Ready**: Full TypeScript support with comprehensive type definitions
- 🔌 **Plugin System**: Extensible plugin architecture for custom integrations
- 🎭 **Theme Support**: Light and dark themes out of the box
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Quick Start 🚀

```typescript
import { MCPClient, ChatWidget } from '@intent-mcp/kit';

// Initialize the client
const client = new MCPClient({
  apiKey: 'your-api-key'
});

// Create a chat widget
const chat = new ChatWidget('#chat-container', client, {
  theme: 'light',
  height: '500px'
});

// Process intents and generate workflows
chat.on('message', async (message) => {
  const intent = await client.processIntent(message);
  const flow = await client.generateWorkflow(intent);
  await client.executeWorkflow(flow);
});
```

## Installation 📦

```bash
# Using npm
npm install @intent-mcp/kit

# Using yarn
yarn add @intent-mcp/kit

# Using pnpm
pnpm add @intent-mcp/kit
```

## Usage 💡

### Core Client

```typescript
import { MCPClient } from '@intent-mcp/kit';

const client = new MCPClient({
  apiKey: 'your-api-key',
  options: {
    timeout: 5000,
    retries: 3
  }
});

// Process an intent
const intent = await client.processIntent('Deploy the application to production');

// Generate a workflow
const flow = await client.generateWorkflow(intent);

// Execute the workflow
const result = await client.executeWorkflow(flow);
```

### Interactive Chat

```typescript
import { ChatWidget } from '@intent-mcp/kit';

const chat = new ChatWidget('#chat', client, {
  theme: 'dark',
  height: '600px',
  placeholder: 'What would you like to do?',
  maxMessages: 100,
  autoScroll: true
});

// Listen for events
chat.on('message', (message) => {
  console.log('New message:', message);
});
```

### Flow Visualization

```typescript
import { FlowViewerWidget } from '@intent-mcp/kit';

const viewer = new FlowViewerWidget('#viewer', flow, {
  height: '800px',
  theme: 'light',
  zoom: {
    min: 0.5,
    max: 3,
    step: 0.1
  }
});

// Update flow data
viewer.updateFlow(newFlow);
```

## Widgets 🎨

The SDK includes ready-to-use UI components:

- **ChatWidget**: Interactive chat interface for natural language interactions
- **FlowViewerWidget**: Visual workflow representation with zoom and pan capabilities
- **Custom Widgets**: Extend `MCPWidget` to create your own components

[Learn more about widgets →](./docs/widgets/README.md)

## API Reference 📚

### MCPClient

- `processIntent(input: string): Promise<DeepIntent>`
- `generateWorkflow(intent: DeepIntent): Promise<DeepFlow>`
- `executeWorkflow(flow: DeepFlow): Promise<WorkflowResult>`

### Widgets

- `ChatWidget`: [Documentation](./docs/widgets/chat-widget.md)
- `FlowViewerWidget`: [Documentation](./docs/widgets/flow-viewer-widget.md)
- `MCPWidget`: [Base Class Documentation](./docs/widgets/base-widget.md)

[Full API Documentation →](./docs/api/README.md)

## Examples 🎮

### Basic Intent Processing

```typescript
const result = await client.processIntent('Scale the web service to 5 replicas');
console.log(result.confidence); // 0.95
console.log(result.action); // { type: 'scale', target: 'web-service', replicas: 5 }
```

### Workflow Generation

```typescript
const workflow = await client.generateWorkflow({
  action: 'deploy',
  target: 'web-app',
  environment: 'production'
});

console.log(workflow.steps); // Array of workflow steps
console.log(workflow.resources); // Required resources
```

[More Examples →](./examples/README.md)

## Documentation 📖

- [Getting Started Guide](./docs/getting-started.md)
- [Core Concepts](./docs/concepts.md)
- [Widget Documentation](./docs/widgets/README.md)
- [API Reference](./docs/api/README.md)
- [Examples](./examples/README.md)
- [Contributing Guide](./CONTRIBUTING.md)

## Contributing 🤝

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support 💬

- 📧 Email: support@intent-mcp.com
- 💬 Discord: [Join our community](https://discord.gg/intent-mcp)
- 🐦 Twitter: [@IntentMCP](https://twitter.com/IntentMCP)
- 📝 Blog: [Intent MCP Blog](https://blog.intent-mcp.com)

---

<p align="center">Made with ❤️ by the Intent MCP Team</p>

<p align="center">
  <a href="https://intent-mcp.com">Website</a> •
  <a href="https://docs.intent-mcp.com">Documentation</a> •
  <a href="https://github.com/openpandacodes/intent-mcp-kit">GitHub</a>
</p>