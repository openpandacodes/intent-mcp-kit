# MCPWidget Base Class

The `MCPWidget` class serves as the foundation for all MCP widgets, providing common functionality for initialization, rendering, and management.

## Overview

The base widget class handles:
- Widget initialization and mounting
- Theme management (light/dark)
- Error handling
- Loading states
- Basic DOM manipulation

## Installation

```typescript
import { MCPWidget } from '@intent-mcp/kit';
```

## Usage

The `MCPWidget` is an abstract class that should be extended by specific widget implementations:

```typescript
class MyCustomWidget extends MCPWidget {
  constructor(element: HTMLElement | string, client: MCPClient, options: WidgetOptions = {}) {
    super(element, client, options);
  }

  public render(): void {
    // Implement your rendering logic here
  }
}
```

## Configuration

### WidgetOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `string` | `'500px'` | Widget height in CSS units |
| `width` | `string` | `'100%'` | Widget width in CSS units |
| `theme` | `'light' \| 'dark'` | `'light'` | Widget color theme |

## API Reference

### Constructor

```typescript
constructor(element: HTMLElement | string, client: MCPClient, options: WidgetOptions = {})
```

Creates a new widget instance.

- `element`: Target DOM element or its ID
- `client`: MCP client instance for API interactions
- `options`: Widget configuration options

### Methods

#### `render(): void`

Abstract method that must be implemented by child classes to render the widget content.

#### `destroy(): void`

Destroys the widget and removes it from the DOM. Cleans up event listeners and resources.

#### `getElement(): HTMLElement`

Returns the widget's DOM element.

### Protected Methods

#### `initialize(): void`

Initializes the widget with base styles and configuration. Called automatically by the constructor.

#### `createErrorElement(message: string): HTMLElement`

Creates an error message element.

#### `showLoading(): void`

Shows a loading spinner in the widget.

#### `hideLoading(): void`

Hides the loading spinner if it exists.

#### `setTheme(theme: 'light' | 'dark'): void`

Sets the widget theme.

## Styling

The widget uses the following CSS classes:

- `.mcp-widget`: Base class for all widgets
- `.mcp-widget-error`: Error message styling
- `.mcp-widget-loader`: Loading spinner container
- `.light`/`.dark`: Theme classes

## Example

```typescript
class SimpleWidget extends MCPWidget {
  constructor(element: HTMLElement, client: MCPClient) {
    super(element, client, { 
      height: '300px',
      theme: 'dark'
    });
  }

  public render(): void {
    const content = document.createElement('div');
    content.textContent = 'Hello, World!';
    this.element.appendChild(content);
  }
}
``` 