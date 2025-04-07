# ChatWidget

The `ChatWidget` is an interactive chat interface for MCP that allows users to send messages and receive responses. It extends the base `MCPWidget` class with chat-specific functionality.

## Overview

The chat widget provides:
- Message input and display
- Message history management
- Auto-scrolling message container
- Integration with MCP client for intent processing
- Light/dark theme support

## Installation

```typescript
import { ChatWidget } from '@intent-mcp/kit';
```

## Usage

```typescript
const client = new MCPClient({ /* client options */ });
const chatWidget = new ChatWidget(
  document.getElementById('chat-container'),
  client,
  {
    height: '600px',
    theme: 'light',
    placeholder: 'Ask me anything...',
    maxMessages: 100,
    autoScroll: true
  }
);
```

## Configuration

### ChatWidgetOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `string` | `'500px'` | Widget height |
| `width` | `string` | `'100%'` | Widget width |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `placeholder` | `string` | `'Type your message...'` | Input placeholder text |
| `maxMessages` | `number` | `undefined` | Maximum messages to keep in history |
| `autoScroll` | `boolean` | `true` | Auto-scroll to new messages |

## API Reference

### Constructor

```typescript
constructor(element: HTMLElement | string, client: MCPClient, options: ChatWidgetOptions = {})
```

Creates a new chat widget instance.

### Methods

#### `render(): void`

Renders the chat messages.

#### `clearMessages(): void`

Clears all messages from the chat history.

#### `getMessages(): Message[]`

Returns a copy of the current message history.

### Message Format

```typescript
interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'assistant';
  metadata?: {
    result?: {
      success: boolean;
      data: any;
    };
  };
}
```

## Styling

The widget uses the following CSS classes:

- `.mcp-chat-widget`: Main container
- `.chat-messages`: Message container
- `.chat-input`: Input container
- `.chat-message`: Individual message
- `.user`: User message styling
- `.assistant`: Assistant message styling

## Events

The widget handles the following events:

- `Enter` key in input: Sends message
- Click on send button: Sends message
- Message processing: Shows loading indicator

## Example

### Basic Usage

```typescript
const chatWidget = new ChatWidget('#chat', client);

// Clear messages programmatically
chatWidget.clearMessages();

// Get message history
const messages = chatWidget.getMessages();
```

### Custom Styling

```typescript
const chatWidget = new ChatWidget('#chat', client, {
  height: '800px',
  theme: 'dark'
});

// Add custom styles
const element = chatWidget.getElement();
element.style.border = '1px solid #ccc';
element.style.borderRadius = '8px';
```

### Message Processing

The widget automatically:
1. Sends user messages to the MCP client
2. Processes intents
3. Generates and executes workflows
4. Displays results or error messages

```typescript
// Message flow:
// 1. User input -> processIntent()
// 2. Intent -> generateWorkflows()
// 3. Workflow -> executeWorkflow()
// 4. Result displayed in chat
```

## Error Handling

The widget handles various error scenarios:

- Network errors during message processing
- Invalid responses from the MCP client
- Rate limiting and throttling
- Message processing failures

Errors are displayed in the chat interface with appropriate error messages. 