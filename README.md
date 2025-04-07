# Intent MCP Kit

A comprehensive SDK for integrating Intent MCP functionality into your applications. This SDK provides tools for processing natural language intents, generating workflows, and visualizing DeepFlows.

## Features

- Core SDK functionality for intent processing
- Widget-based frontend integration
- DeepFlow visualization
- Authentication utilities
- DIML parsing utilities
- TypeScript support
- Comprehensive documentation

## Installation

```bash
npm install intent-mcp-kit
# or
yarn add intent-mcp-kit
```

## Quick Start

```typescript
import { MCPClient } from 'intent-mcp-kit';

const client = new MCPClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.mcp-servers.io/v1'
});

// Process an intent
const intent = await client.processIntent('I want to plan a trip to Paris');
console.log('Processed intent:', intent);
```

## Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Integration Guide](./docs/integration.md)
- [API Reference](./docs/sdk-reference.md)
- [Widget Documentation](./docs/widgets.md)

## Examples

Check out our [examples directory](./examples/) for complete integration examples:
- Basic integration
- Custom widgets
- Advanced use cases

## Development

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/your-org/intent-mcp-kit.git

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Available Scripts
- `npm run build` - Build the project
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run docs` - Generate documentation

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For support, please:
- Check our [documentation](./docs/)
- Open an issue on GitHub
- Join our developer community