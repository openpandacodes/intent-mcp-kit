# Widget Documentation

The Intent MCP Kit provides a set of customizable UI widgets that can be easily integrated into your application. This guide covers the available widgets, their configuration options, and best practices for implementation.

## Table of Contents

- [Base Widget Class](#base-widget-class)
- [Chat Widget](#chat-widget)
- [Flow Viewer Widget](#flow-viewer-widget)
- [Events System](#events-system)
- [Styling and Theming](#styling-and-theming)
- [Best Practices](#best-practices)

## Base Widget Class

The `MCPWidget` class serves as the foundation for all widgets in the Intent MCP Kit. It provides common functionality and a consistent interface for widget implementation.

### Properties

```typescript
class MCPWidget {
  protected element: HTMLElement;
  protected client: MCPClient;
  protected options: MCPWidgetOptions;
  
  // Common widget options
  interface MCPWidgetOptions {
    theme?: 'light' | 'dark';
    height?: string;
    width?: string;
    className?: string;
  }
}
```

### Methods

- `constructor(element: HTMLElement | string, client: MCPClient, options?: MCPWidgetOptions)`
- `render(): void`
- `destroy(): void`
- `on(event: string, handler: Function): void`
- `off(event: string, handler: Function): void`
- `setTheme(theme: 'light' | 'dark'): void`
- `showLoading(): void`
- `hideLoading(): void`
- `createError(message: string): HTMLElement`

## Chat Widget

The `ChatWidget` provides a chat interface for interacting with the MCP system through natural language.

### Usage

```typescript
import { MCPClient, ChatWidget } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: 'your-api-key'
});

const chat = new ChatWidget('#chat-container', client, {
  theme: 'light',
  height: '500px',
  placeholder: 'What would you like to do?',
  maxMessages: 100,
  autoScroll: true
});
```

### Configuration Options

```typescript
interface ChatWidgetOptions extends MCPWidgetOptions {
  placeholder?: string;
  maxMessages?: number;
  autoScroll?: boolean;
  inputPosition?: 'top' | 'bottom';
  showTimestamp?: boolean;
  messageStyles?: {
    user?: string;
    assistant?: string;
  };
}
```

### Events

- `message`: Fired when a new message is sent
- `typing`: Fired when the user is typing
- `clear`: Fired when the chat is cleared
- `error`: Fired when an error occurs

### Methods

- `addMessage(message: ChatMessage): void`
- `clearMessages(): void`
- `setPlaceholder(text: string): void`
- `focus(): void`
- `disable(): void`
- `enable(): void`

## Flow Viewer Widget

The `FlowViewerWidget` visualizes workflows generated from intents, showing the steps, dependencies, and execution status.

### Usage

```typescript
import { MCPClient, FlowViewerWidget } from '@aintent/mcp-kit';

const client = new MCPClient({
  apiKey: 'your-api-key'
});

const viewer = new FlowViewerWidget('#flow-container', null, {
  theme: 'light',
  height: '600px',
  zoom: {
    min: 0.5,
    max: 3,
    step: 0.1
  },
  layout: 'vertical'
});
```

### Configuration Options

```typescript
interface FlowViewerOptions extends MCPWidgetOptions {
  zoom?: {
    min?: number;
    max?: number;
    step?: number;
    initial?: number;
  };
  layout?: 'horizontal' | 'vertical';
  showMinimap?: boolean;
  nodeStyles?: {
    pending?: string;
    running?: string;
    completed?: string;
    failed?: string;
  };
}
```

### Events

- `nodeClick`: Fired when a node is clicked
- `nodeHover`: Fired when a node is hovered
- `zoomChange`: Fired when zoom level changes
- `layoutChange`: Fired when layout changes

### Methods

- `updateFlow(flow: DeepFlow): void`
- `clearFlow(): void`
- `zoomIn(): void`
- `zoomOut(): void`
- `fitView(): void`
- `setLayout(layout: 'horizontal' | 'vertical'): void`
- `highlightNode(nodeId: string): void`

## Events System

Widgets use a consistent event system that allows you to respond to various widget states and user interactions.

### Event Handling

```typescript
// Adding event listeners
widget.on('eventName', (data) => {
  console.log('Event data:', data);
});

// Removing event listeners
widget.off('eventName', handler);
```

### Common Events

All widgets emit these base events:
- `init`: When the widget is initialized
- `destroy`: When the widget is destroyed
- `themeChange`: When the theme is changed
- `error`: When an error occurs
- `loading`: When loading state changes

## Styling and Theming

Widgets support customization through themes and CSS variables.

### Theme Configuration

```typescript
// Setting theme during initialization
const widget = new MCPWidget('#container', client, {
  theme: 'dark'
});

// Changing theme after initialization
widget.setTheme('light');
```

### CSS Variables

```css
:root {
  /* Base colors */
  --mcp-primary-color: #007bff;
  --mcp-secondary-color: #6c757d;
  --mcp-success-color: #28a745;
  --mcp-error-color: #dc3545;
  
  /* Text colors */
  --mcp-text-primary: #212529;
  --mcp-text-secondary: #6c757d;
  
  /* Background colors */
  --mcp-bg-primary: #ffffff;
  --mcp-bg-secondary: #f8f9fa;
  
  /* Border styles */
  --mcp-border-color: #dee2e6;
  --mcp-border-radius: 4px;
  
  /* Spacing */
  --mcp-spacing-sm: 0.5rem;
  --mcp-spacing-md: 1rem;
  --mcp-spacing-lg: 1.5rem;
}
```

## Best Practices

### 1. Error Handling

Always implement error handling for widget events:

```typescript
widget.on('error', (error) => {
  console.error('Widget error:', error);
  // Display error to user or take corrective action
});
```

### 2. Resource Management

Properly clean up widgets when they're no longer needed:

```typescript
// In your component's cleanup/unmount
widget.destroy();
```

### 3. Responsive Design

Consider different screen sizes:

```typescript
const chat = new ChatWidget('#chat', client, {
  height: '50vh',
  width: '100%',
  // Use CSS media queries for responsive styling
});
```

### 4. Performance Optimization

- Limit the number of stored messages in ChatWidget
- Use appropriate zoom levels in FlowViewer
- Implement pagination or virtualization for large datasets

```typescript
const chat = new ChatWidget('#chat', client, {
  maxMessages: 100, // Prevent memory issues
  autoScroll: true  // Better UX for long conversations
});
```

### 5. Accessibility

Ensure your widgets are accessible:

```typescript
const chat = new ChatWidget('#chat', client, {
  className: 'accessible-chat',
  // Add ARIA labels and roles through CSS
});

// Add keyboard navigation support
chat.on('keydown', (event) => {
  // Handle keyboard navigation
});
```

## Additional Resources

- [API Reference](../api/README.md)
- [Examples](../examples/README.md)
- [Core Concepts](../concepts.md)
- [Contributing Guide](../CONTRIBUTING.md) 