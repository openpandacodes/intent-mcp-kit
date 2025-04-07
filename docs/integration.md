# Intent MCP Kit Integration Guide

This guide will help you integrate the Intent MCP Kit into your application to leverage AI capabilities through the MCP servers.

## Prerequisites

- Node.js v14 or higher
- npm or yarn package manager
- API key for MCP Servers (request from [developer portal](#))

## Installation

```bash
npm install intent-mcp-kit
# or
yarn add intent-mcp-kit
```

## Basic Integration

### 1. Initialize the MCP Client

```javascript
import { MCPClient } from 'intent-mcp-kit';

const client = new MCPClient({
  apiKey: 'your-api-key-here',
  // Optional: customize base URL if needed
  baseUrl: 'https://api.mcp-servers.io/v1'
});

// Connect to the MCP server
await client.connect();
```

### 2. Process User Intent

```javascript
// Process a natural language intent
const intent = await client.processIntent('I want to plan a trip to Paris for next week with a budget of $2000');

console.log('Processed intent:', intent);
// This will return a structured DeepIntent object
```

### 3. Generate and Execute Workflows

```javascript
// Generate workflow options
const workflows = await client.generateWorkflows(intent);

// Select a workflow (in a real application, you'd let the user choose)
const selectedWorkflow = workflows[0];

// Execute the selected workflow
const result = await client.executeWorkflow(selectedWorkflow);

console.log('Execution result:', result);
```

## Widget Integration

### Chat Widget

The Chat Widget provides a ready-to-use chat interface for interacting with MCP.

```javascript
import { ChatWidget } from 'intent-mcp-kit/widgets';

// Create a chat widget
const chatWidget = new ChatWidget(
  document.getElementById('chat-container'), // Or any DOM element
  client, // Your initialized MCPClient
  {
    height: '500px',
    width: '100%',
    placeholder: 'What would you like to do?'
  }
);

// Listen for new messages
document.getElementById('chat-container').addEventListener('message', (event) => {
  console.log('New message:', event.detail);
});
```

### Flow Viewer Widget

The Flow Viewer Widget visualizes DeepFlows for better understanding.

```javascript
import { FlowViewerWidget } from 'intent-mcp-kit/widgets';

// Create a flow viewer widget
const flowViewer = new FlowViewerWidget(
  document.getElementById('flow-container'),
  selectedWorkflow // A DeepFlow object
);

// Render the flow visualization
flowViewer.render();
```

## Advanced Integration

### Custom Resource Providers

You can query available resource providers and their capabilities:

```javascript
const providers = await client.getResourceProviders();
console.log('Available providers:', providers);
```

### Error Handling

Always implement proper error handling:

```javascript
try {
  const intent = await client.processIntent('My complex intent');
  // Process the intent
} catch (error) {
  console.error('Intent processing failed:', error.message);
  // Handle the error appropriately
}
```

## API Reference

For detailed API documentation, please refer to the [SDK Reference](./sdk-reference.md).

## Next Steps

- Explore [example applications](../examples/) for more integration patterns
- Learn about [customizing widgets](./widgets.md) to match your application's design
- Join our [developer community](#) for support and updates
