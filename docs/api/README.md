# API Reference

Complete API documentation for the Intent MCP Kit.

## Table of Contents

- [MCPClient](#mcpclient)
- [DeepIntent](#deepintent)
- [DeepFlow](#deepflow)
- [Widgets](#widgets)
- [Events](#events)
- [Error Handling](#error-handling)

## MCPClient

The main client for interacting with the MCP system.

### Constructor

```typescript
constructor(config: MCPClientConfig)
```

#### Parameters

```typescript
interface MCPClientConfig {
  apiKey: string;
  options?: {
    timeout?: number;
    retries?: number;
    baseUrl?: string;
    version?: string;
  };
}
```

### Methods

#### processIntent

```typescript
async processIntent(input: string): Promise<DeepIntent>
```

Processes natural language input into a structured intent.

#### generateWorkflow

```typescript
async generateWorkflow(intent: DeepIntent): Promise<DeepFlow>
```

Generates a workflow from a processed intent.

#### executeWorkflow

```typescript
async executeWorkflow(flow: DeepFlow): Promise<WorkflowResult>
```

Executes a generated workflow.

## DeepIntent

Represents a processed user intent.

```typescript
interface DeepIntent {
  id: string;
  input: string;
  confidence: number;
  action: {
    type: string;
    target: string;
    parameters: Record<string, any>;
  };
  context?: Record<string, any>;
  metadata?: {
    created: string;
    source: string;
    version: string;
  };
}
```

## DeepFlow

Represents a workflow generated from an intent.

```typescript
interface DeepFlow {
  id: string;
  intent: DeepIntent;
  resources: Resource[];
  steps: Step[];
  metadata: {
    created: string;
    version: string;
    status: FlowStatus;
  };
}

interface Resource {
  id: string;
  type: string;
  provider: string;
  config: Record<string, any>;
}

interface Step {
  id: string;
  action: {
    type: string;
    resource: string;
    parameters: Record<string, any>;
  };
  dependencies: string[];
  status: StepStatus;
  result?: any;
}
```

## Widgets

### MCPWidget (Base Class)

```typescript
abstract class MCPWidget {
  protected element: HTMLElement;
  protected client: MCPClient;
  protected options: WidgetOptions;

  constructor(element: HTMLElement | string, client: MCPClient, options?: WidgetOptions);
  abstract render(): void;
  destroy(): void;
  getElement(): HTMLElement;
}

interface WidgetOptions {
  height?: string;
  width?: string;
  theme?: 'light' | 'dark';
}
```

### ChatWidget

```typescript
class ChatWidget extends MCPWidget {
  constructor(element: HTMLElement | string, client: MCPClient, options?: ChatWidgetOptions);
  
  // Methods
  clearMessages(): void;
  getMessages(): Message[];
  render(): void;
  
  // Events
  on(event: 'message', handler: (message: Message) => void): void;
  on(event: 'intent', handler: (intent: DeepIntent) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
}

interface ChatWidgetOptions extends WidgetOptions {
  placeholder?: string;
  maxMessages?: number;
  autoScroll?: boolean;
}
```

### FlowViewerWidget

```typescript
class FlowViewerWidget extends MCPWidget {
  constructor(element: HTMLElement | string, flow: DeepFlow, options?: FlowViewerOptions);
  
  // Methods
  updateFlow(flow: DeepFlow): void;
  render(): void;
  resetView(): void;
  
  // Events
  on(event: 'nodeClick', handler: (node: Node) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
}

interface FlowViewerOptions extends WidgetOptions {
  zoom?: {
    min: number;
    max: number;
    step: number;
  };
  pan?: {
    enabled: boolean;
    speed: number;
  };
}
```

## Events

### Global Events

```typescript
client.on('intent:processed', (intent: DeepIntent) => {});
client.on('workflow:generated', (flow: DeepFlow) => {});
client.on('workflow:executed', (result: WorkflowResult) => {});
client.on('error', (error: Error) => {});
```

### Widget Events

```typescript
// ChatWidget Events
chat.on('message', (message: Message) => {});
chat.on('intent', (intent: DeepIntent) => {});

// FlowViewerWidget Events
viewer.on('nodeClick', (node: Node) => {});
viewer.on('statusChange', (status: FlowStatus) => {});
```

## Error Handling

### Error Types

```typescript
class IntentError extends Error {
  code: string;
  details: Record<string, any>;
}

class WorkflowError extends Error {
  code: string;
  step: Step;
  details: Record<string, any>;
}

class WidgetError extends Error {
  code: string;
  widget: string;
  details: Record<string, any>;
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INTENT_PROCESSING_FAILED` | Failed to process natural language input |
| `WORKFLOW_GENERATION_FAILED` | Failed to generate workflow from intent |
| `WORKFLOW_EXECUTION_FAILED` | Failed to execute workflow |
| `INVALID_CONFIGURATION` | Invalid client or widget configuration |
| `NETWORK_ERROR` | Network request failed |
| `AUTHENTICATION_ERROR` | API key or authentication failed |

## Type Definitions

For complete type definitions, see our [TypeScript documentation](https://docs.aintent.ai/types). 