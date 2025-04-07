# Core Concepts

This guide explains the fundamental concepts and architecture of the Intent MCP Kit.

## Overview

Intent MCP Kit is built around three core concepts:
1. Intent Processing
2. Workflow Generation
3. Workflow Execution

## 1. Intent Processing

### What is an Intent?

An intent represents a user's desired action or goal, expressed in natural language. The MCP system processes this natural language input and converts it into a structured `DeepIntent` object.

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
}
```

### Intent Processing Flow

1. **Input Analysis**: Natural language input is analyzed for key components
2. **Context Evaluation**: Current system context is considered
3. **Intent Classification**: Input is classified into specific action types
4. **Parameter Extraction**: Relevant parameters are extracted from the input
5. **Confidence Scoring**: System assigns a confidence score to the interpretation

## 2. Workflow Generation

### What is a DeepFlow?

A DeepFlow is a directed acyclic graph (DAG) representing the steps needed to accomplish an intent. It includes:
- Resources required
- Steps to be executed
- Dependencies between steps
- Error handling procedures

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
```

### Workflow Generation Process

1. **Resource Identification**: Determine required resources
2. **Step Planning**: Break down the intent into executable steps
3. **Dependency Resolution**: Establish step dependencies
4. **Validation**: Ensure the workflow is valid and executable
5. **Optimization**: Optimize the workflow for efficiency

## 3. Workflow Execution

### Execution Process

1. **Resource Preparation**: Ensure all required resources are available
2. **Step Execution**: Execute steps in dependency order
3. **State Management**: Track execution state
4. **Error Handling**: Handle and recover from failures
5. **Result Collection**: Gather and format results

### Execution States

```typescript
enum FlowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}
```

## UI Components

### Widget Architecture

All widgets extend the base `MCPWidget` class:

```typescript
abstract class MCPWidget {
  protected element: HTMLElement;
  protected client: MCPClient;
  protected options: WidgetOptions;

  constructor(element: HTMLElement | string, client: MCPClient, options?: WidgetOptions);
  abstract render(): void;
}
```

### Widget Types

1. **ChatWidget**: Interactive chat interface
   - Message handling
   - Intent processing
   - Real-time updates

2. **FlowViewerWidget**: Workflow visualization
   - Interactive graph display
   - Step status visualization
   - Real-time updates

## Event System

The SDK uses an event-driven architecture:

```typescript
interface EventEmitter {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data: any): void;
}
```

Common events:
- `intent:processed`
- `workflow:generated`
- `workflow:executed`
- `error`

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
```

### Error Recovery

1. **Retry Logic**: Automatic retries for transient failures
2. **Fallback Mechanisms**: Alternative execution paths
3. **State Recovery**: Workflow state preservation

## Security

### Authentication

- API Key based authentication
- Token-based session management
- Role-based access control

### Data Protection

- End-to-end encryption
- Secure data storage
- Audit logging

## Next Steps

- Follow the [Getting Started Guide](./getting-started.md)
- Explore [Examples](./examples/README.md)
- Read the [API Reference](./api/README.md)
- Learn about [Widgets](./widgets/README.md) 