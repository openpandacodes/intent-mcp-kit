# Getting Started with Intent MCP Kit

Welcome to Intent MCP Kit! This guide will help you get up and running with our SDK quickly.

## Prerequisites

- Node.js >= 14.0.0
- npm, yarn, or pnpm
- Basic knowledge of TypeScript
- An API key from Aintent.ai

## Installation

```bash
# Using npm
npm install @aintent/mcp-kit

# Using yarn
yarn add @aintent/mcp-kit

# Using pnpm
pnpm add @aintent/mcp-kit
```

## Basic Setup

1. **Initialize the Client**

```typescript
import { MCPClient } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: 'your-api-key',
  options: {
    timeout: 5000,
    retries: 3
  }
});
```

2. **Process Your First Intent**

```typescript
async function processUserIntent(input: string) {
  try {
    const intent = await client.processIntent(input);
    console.log('Processed Intent:', intent);
    return intent;
  } catch (error) {
    console.error('Error processing intent:', error);
  }
}

// Example usage
await processUserIntent('Deploy the application to production');
```

3. **Generate and Execute a Workflow**

```typescript
async function handleWorkflow(intent: DeepIntent) {
  try {
    // Generate workflow from intent
    const flow = await client.generateWorkflow(intent);
    
    // Execute the workflow
    const result = await client.executeWorkflow(flow);
    
    console.log('Workflow Result:', result);
    return result;
  } catch (error) {
    console.error('Error handling workflow:', error);
  }
}
```

## Adding UI Components

### Chat Widget

```typescript
import { ChatWidget } from '@aintent/mcp-kit';

const chat = new ChatWidget('#chat-container', client, {
  theme: 'light',
  height: '500px',
  placeholder: 'What would you like to do?'
});

// Handle messages
chat.on('message', async (message) => {
  const intent = await client.processIntent(message);
  // Handle the intent...
});
```

### Flow Viewer

```typescript
import { FlowViewerWidget } from '@aintent/mcp-kit';

const viewer = new FlowViewerWidget('#flow-container', flow, {
  height: '600px',
  theme: 'light'
});
```

## Error Handling

```typescript
try {
  const intent = await client.processIntent(userInput);
  const flow = await client.generateWorkflow(intent);
  const result = await client.executeWorkflow(flow);
} catch (error) {
  if (error instanceof IntentError) {
    console.error('Intent processing failed:', error.message);
  } else if (error instanceof WorkflowError) {
    console.error('Workflow execution failed:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Best Practices

1. **API Key Security**
   - Never expose your API key in client-side code
   - Use environment variables for API key storage
   - Implement proper key rotation practices

2. **Error Handling**
   - Always implement proper error handling
   - Provide user-friendly error messages
   - Log errors for debugging

3. **Performance**
   - Implement request caching where appropriate
   - Use connection pooling for multiple requests
   - Consider rate limiting for high-traffic applications

4. **UI Integration**
   - Follow responsive design principles
   - Implement proper loading states
   - Handle offline scenarios gracefully

## Next Steps

- Explore the [Core Concepts](./concepts.md)
- Check out our [Examples](./examples/README.md)
- Read the [API Reference](./api/README.md)
- Learn about our [Widgets](./widgets/README.md)

## Need Help?

- 📧 Email: aby@helloaxes.com
- 🐦 Twitter: [@aintent_](https://x.com/aintent_)
- 📝 Documentation: [docs.aintent.ai](https://docs.aintent.ai)
- 💻 GitHub Issues: [Report a bug](https://github.com/aintent/mcp-kit/issues) 