# MCP Widgets Documentation

This directory contains documentation for the MCP widget components, which provide interactive UI elements for the MCP (Machine Comprehension and Processing) SDK.

## Available Widgets

### [MCPWidget (Base)](./base-widget.md)
The foundation class for all MCP widgets, providing common functionality for initialization, rendering, and management.

### [ChatWidget](./chat-widget.md)
An interactive chat interface that allows users to send messages and receive responses from the MCP system.

### [FlowViewerWidget](./flow-viewer-widget.md)
A visualization widget that displays MCP flows as interactive SVG diagrams with zoom and pan capabilities.

## Common Features

All widgets share these common features:
- Light/dark theme support
- Responsive design
- Error handling
- Loading states
- DOM event management

## Getting Started

1. Install the MCP SDK:
```bash
npm install @intent-mcp/kit
```

2. Import the desired widget:
```typescript
import { ChatWidget, FlowViewerWidget } from '@intent-mcp/kit';
```

3. Create a widget instance:
```typescript
const widget = new ChatWidget('#container', client, {
  theme: 'light',
  height: '500px'
});
```

## Widget Architecture

The widgets follow a hierarchical structure:

```
MCPWidget (Base)
├── ChatWidget
└── FlowViewerWidget
```

Each widget:
- Extends the base `MCPWidget` class
- Implements the abstract `render()` method
- Adds its own specific functionality
- Manages its own state and UI

## Best Practices

1. **Initialization**
   - Always provide an MCPClient instance
   - Use semantic IDs for container elements
   - Configure appropriate dimensions

2. **Error Handling**
   - Listen for widget error events
   - Provide fallback UI for errors
   - Handle network failures gracefully

3. **Styling**
   - Use provided theme system
   - Extend with custom CSS when needed
   - Maintain responsive design

4. **Performance**
   - Clean up resources with destroy()
   - Limit DOM updates
   - Use efficient event handlers

## Example Usage

### Combined Widgets

```typescript
import { ChatWidget, FlowViewerWidget } from '@intent-mcp/kit';

// Create client
const client = new MCPClient({
  apiKey: 'your-api-key'
});

// Initialize chat
const chat = new ChatWidget('#chat', client, {
  height: '400px',
  theme: 'light'
});

// Initialize flow viewer
const viewer = new FlowViewerWidget('#viewer', flow, {
  height: '600px',
  theme: 'light'
});

// Link widgets (example)
chat.on('flowGenerated', (flow) => {
  viewer.updateFlow(flow);
});
```

## Browser Support

The widgets are tested and supported in:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

To contribute to the widgets:
1. Follow the TypeScript style guide
2. Add JSDoc documentation
3. Include unit tests
4. Update relevant documentation

## License

The MCP SDK and widgets are licensed under the MIT License. See the LICENSE file for details. 