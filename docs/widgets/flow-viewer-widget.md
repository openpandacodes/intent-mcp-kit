# FlowViewerWidget

The `FlowViewerWidget` is an interactive flow visualization widget that displays MCP flows as interactive SVG diagrams. It extends the base `MCPWidget` class with flow visualization capabilities.

## Overview

The flow viewer provides:
- Interactive SVG-based flow visualization
- Resource and step node rendering
- Connection visualization between nodes
- Zoom and pan controls
- Light/dark theme support

## Installation

```typescript
import { FlowViewerWidget } from '@intent-mcp/kit';
```

## Usage

```typescript
const flow = new DeepFlow({ /* flow configuration */ });
const flowViewer = new FlowViewerWidget(
  document.getElementById('flow-container'),
  flow,
  {
    height: '800px',
    theme: 'light',
    zoom: {
      min: 0.5,
      max: 3,
      step: 0.1
    },
    pan: {
      enabled: true,
      speed: 1.5
    }
  }
);
```

## Configuration

### FlowViewerOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `string` | `'500px'` | Widget height |
| `width` | `string` | `'100%'` | Widget width |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `zoom.min` | `number` | `0.1` | Minimum zoom level |
| `zoom.max` | `number` | `2` | Maximum zoom level |
| `zoom.step` | `number` | `0.1` | Zoom step size |
| `pan.enabled` | `boolean` | `true` | Enable panning |
| `pan.speed` | `number` | `1` | Pan speed multiplier |

## API Reference

### Constructor

```typescript
constructor(element: HTMLElement | string, flow: DeepFlow, options: FlowViewerOptions = {})
```

Creates a new flow viewer instance.

### Methods

#### `render(): void`

Renders the flow diagram.

#### `updateFlow(flow: DeepFlow): void`

Updates the flow being visualized and re-renders the diagram.

### Visual Elements

The flow viewer creates several types of visual elements:

#### Resource Nodes
- Rectangular nodes representing resources
- Color-coded based on theme
- Displays resource ID

#### Step Nodes
- Rectangular nodes representing workflow steps
- Color-coded based on theme
- Displays step ID

#### Connections
- Curved paths connecting nodes
- Shows dependencies between steps
- Shows resource usage by steps

## Interactions

The widget supports the following user interactions:

### Zooming
- Mouse wheel: Zoom in/out
- Toolbar buttons: Zoom in (+), Zoom out (-)
- Reset button: Reset zoom level

### Panning
- Left mouse button drag: Pan the view
- Speed configurable via options
- Auto-bounds checking

### Tooltips
- Hover over nodes: Shows additional information
- Hover over connections: Shows relationship details

## Styling

The widget uses the following CSS classes:

- `.flow-viewer`: Main container
- `.flow-toolbar`: Control toolbar
- `.flow-tooltip`: Hover tooltips

## Example

### Basic Usage

```typescript
const flowViewer = new FlowViewerWidget('#viewer', flow);

// Update flow data
const newFlow = new DeepFlow({ /* updated flow */ });
flowViewer.updateFlow(newFlow);
```

### Custom Configuration

```typescript
const flowViewer = new FlowViewerWidget('#viewer', flow, {
  height: '1000px',
  theme: 'dark',
  zoom: {
    min: 0.2,
    max: 4,
    step: 0.2
  },
  pan: {
    enabled: true,
    speed: 2
  }
});
```

### Layout Customization

The flow viewer automatically layouts nodes, but you can customize the appearance:

```typescript
// Custom node styling
const element = flowViewer.getElement();
const style = document.createElement('style');
style.textContent = `
  .flow-viewer rect {
    stroke-width: 2px;
  }
  .flow-viewer text {
    font-family: 'Arial', sans-serif;
    font-size: 12px;
  }
  .flow-viewer path {
    stroke-dasharray: 4;
  }
`;
element.appendChild(style);
```

## Performance

The widget is optimized for performance:
- Efficient SVG rendering
- Smooth pan and zoom
- Throttled event handlers
- Smart connection routing

For large flows (>100 nodes), consider:
- Increasing minimum zoom level
- Disabling auto-pan
- Using simpler connection paths

## Browser Support

The widget requires modern browser features:
- SVG support
- CSS transforms
- Pointer events
- Web Animations API

Tested and supported in:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+ 