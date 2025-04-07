# Intent MCP Kit

[![npm version](https://img.shields.io/npm/v/@aintent/mcp-kit.svg?style=flat)](https://www.npmjs.com/package/@aintent/mcp-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/aintent/mcp-kit/blob/main/docs/CONTRIBUTING.md)

Machine Comprehension and Processing (MCP) SDK by Aintent.ai, an Axes Labs company. Build intelligent applications with natural language understanding and automated workflow generation.

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md) - Quick start guide and basic usage
- [Core Concepts](docs/concepts.md) - Understanding MCP architecture and concepts
- [API Reference](docs/api/README.md) - Detailed API documentation
- [Widget Documentation](docs/widgets/README.md) - UI components and customization
- [Examples](docs/examples/README.md) - Code examples and use cases
- [Contributing Guide](docs/CONTRIBUTING.md) - Guidelines for contributors

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @aintent/mcp-kit

# Using yarn
yarn add @aintent/mcp-kit

# Using pnpm
pnpm add @aintent/mcp-kit
```

### Basic Usage

```typescript
import { MCPClient } from '@aintent/mcp-kit';

// Initialize client
const client = new MCPClient({
  apiKey: 'your-api-key'
});

// Process intent
const intent = await client.processIntent(
  'Deploy the application to production'
);

// Generate workflow
const flow = await client.generateWorkflow(intent);

// Execute workflow
const result = await client.executeWorkflow(flow);
```

### Adding UI Components

```typescript
import { ChatWidget, FlowViewerWidget } from '@aintent/mcp-kit';

// Create chat widget
const chat = new ChatWidget('#chat-container', client, {
  theme: 'light',
  height: '500px'
});

// Create flow viewer
const viewer = new FlowViewerWidget('#flow-container', null, {
  theme: 'light',
  height: '600px'
});

// Link widgets
chat.on('message', async (message) => {
  const intent = await client.processIntent(message.content);
  const flow = await client.generateWorkflow(intent);
  viewer.updateFlow(flow);
});
```

## 🔑 Key Features

- Natural Language Understanding
- Automated Workflow Generation
- Workflow Visualization
- Interactive Chat Interface
- TypeScript Support
- Customizable UI Components
- Event-Driven Architecture
- Error Handling
- Theming Support

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/aintent/mcp-kit.git
cd mcp-kit

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- [Website](https://aintent.ai)
- [Documentation](https://aintent.ai/docs)
- [Blog](https://aintent.ai/blog)
- [Twitter](https://twitter.com/aintent_)
- [Founder](https://twitter.com/magicofanon)

## 💬 Support

- Email: [aby@helloaxes.com](mailto:aby@helloaxes.com)
- GitHub Issues: [Report a bug](https://github.com/aintent/mcp-kit/issues)
- Discord: [Join our community](https://discord.gg/aintent)

---

Made with ❤️ by [Aintent.ai](https://aintent.ai), an Axes Labs company