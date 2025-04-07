# Examples

This directory contains examples demonstrating various use cases of the Intent MCP Kit.

## Basic Examples

### 1. Simple Intent Processing

```typescript
// examples/basic/intent-processing.ts
import { MCPClient } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

async function main() {
  try {
    const intent = await client.processIntent(
      'Deploy the web application to production'
    );
    
    console.log('Processed Intent:', intent);
    console.log('Confidence:', intent.confidence);
    console.log('Action:', intent.action);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### 2. Workflow Generation and Execution

```typescript
// examples/basic/workflow-execution.ts
import { MCPClient } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

async function main() {
  try {
    // Process intent
    const intent = await client.processIntent(
      'Scale the web service to 5 replicas'
    );
    
    // Generate workflow
    const flow = await client.generateWorkflow(intent);
    
    // Execute workflow
    const result = await client.executeWorkflow(flow);
    
    console.log('Execution Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Widget Examples

### 1. Chat Widget Integration

```typescript
// examples/widgets/chat-integration.ts
import { MCPClient, ChatWidget } from '@aintent/mcp-kit';

// Initialize client
const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

// Create chat widget
const chat = new ChatWidget('#chat-container', client, {
  theme: 'light',
  height: '500px',
  placeholder: 'What would you like to do?',
  maxMessages: 100
});

// Handle messages
chat.on('message', async (message) => {
  try {
    // Process intent
    const intent = await client.processIntent(message.content);
    
    // Generate and execute workflow
    const flow = await client.generateWorkflow(intent);
    const result = await client.executeWorkflow(flow);
    
    // Display result
    chat.addMessage({
      content: `Task completed: ${result.summary}`,
      sender: 'assistant'
    });
  } catch (error) {
    chat.addMessage({
      content: `Error: ${error.message}`,
      sender: 'assistant'
    });
  }
});
```

### 2. Flow Viewer Integration

```typescript
// examples/widgets/flow-viewer.ts
import { MCPClient, FlowViewerWidget } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

// Create flow viewer
const viewer = new FlowViewerWidget('#flow-container', null, {
  height: '600px',
  theme: 'light',
  zoom: {
    min: 0.5,
    max: 3,
    step: 0.1
  }
});

// Process intent and display flow
async function processAndDisplay(input: string) {
  try {
    const intent = await client.processIntent(input);
    const flow = await client.generateWorkflow(intent);
    
    // Update viewer with new flow
    viewer.updateFlow(flow);
    
    // Handle node clicks
    viewer.on('nodeClick', (node) => {
      console.log('Node clicked:', node);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Advanced Examples

### 1. Combined Widget Usage

```typescript
// examples/advanced/combined-widgets.ts
import { MCPClient, ChatWidget, FlowViewerWidget } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

// Create widgets
const chat = new ChatWidget('#chat', client);
const viewer = new FlowViewerWidget('#viewer', null);

// Link widgets
chat.on('message', async (message) => {
  try {
    const intent = await client.processIntent(message.content);
    const flow = await client.generateWorkflow(intent);
    
    // Update flow viewer
    viewer.updateFlow(flow);
    
    // Execute workflow
    const result = await client.executeWorkflow(flow);
    
    // Display result
    chat.addMessage({
      content: `Task completed: ${result.summary}`,
      sender: 'assistant'
    });
  } catch (error) {
    chat.addMessage({
      content: `Error: ${error.message}`,
      sender: 'assistant'
    });
  }
});
```

### 2. Custom Error Handling

```typescript
// examples/advanced/error-handling.ts
import { MCPClient, IntentError, WorkflowError } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: process.env.MCP_API_KEY
});

async function processWithRetry(input: string, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const intent = await client.processIntent(input);
      const flow = await client.generateWorkflow(intent);
      return await client.executeWorkflow(flow);
    } catch (error) {
      retries++;
      
      if (error instanceof IntentError) {
        console.error('Intent processing failed:', error.message);
        if (retries === maxRetries) throw error;
      } else if (error instanceof WorkflowError) {
        console.error('Workflow error:', error.message);
        if (error.step) {
          console.error('Failed step:', error.step.id);
        }
        throw error;
      } else {
        console.error('Unknown error:', error);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
}
```

### 3. Custom Widget Extension

```typescript
// examples/advanced/custom-widget.ts
import { MCPWidget, MCPClient } from '@aintent/mcp-kit';

interface DashboardWidgetOptions {
  theme?: 'light' | 'dark';
  refreshInterval?: number;
}

class DashboardWidget extends MCPWidget {
  private refreshInterval: number;
  private data: any = null;
  
  constructor(
    element: HTMLElement | string,
    client: MCPClient,
    options: DashboardWidgetOptions = {}
  ) {
    super(element, client, options);
    this.refreshInterval = options.refreshInterval || 5000;
    this.startRefreshCycle();
  }
  
  private async refreshData() {
    try {
      // Fetch latest data
      const intent = await this.client.processIntent('get system status');
      const flow = await this.client.generateWorkflow(intent);
      this.data = await this.client.executeWorkflow(flow);
      
      // Update display
      this.render();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  }
  
  private startRefreshCycle() {
    setInterval(() => this.refreshData(), this.refreshInterval);
  }
  
  public render(): void {
    if (!this.data) {
      this.element.innerHTML = 'Loading...';
      return;
    }
    
    // Render dashboard with data
    this.element.innerHTML = `
      <div class="dashboard">
        <h2>System Status</h2>
        <pre>${JSON.stringify(this.data, null, 2)}</pre>
      </div>
    `;
  }
}
```

## Running the Examples

1. Clone the repository:
```bash
git clone https://github.com/aintent/mcp-kit.git
cd mcp-kit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
export MCP_API_KEY=your-api-key
```

4. Run an example:
```bash
# Using ts-node
npx ts-node examples/basic/intent-processing.ts

# Or compile and run
npm run build
node dist/examples/basic/intent-processing.js
```

## Additional Resources

- [API Reference](../api/README.md)
- [Core Concepts](../concepts.md)
- [Widget Documentation](../widgets/README.md) 