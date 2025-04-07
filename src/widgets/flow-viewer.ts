// src/widgets/flow-viewer.ts
import { MCPWidget } from './base';
import { MCPClient, DeepFlow, WidgetOptions } from '../core';

/**
 * Configuration options for the FlowViewerWidget.
 * Extends the base WidgetOptions with zoom and pan controls.
 */
interface FlowViewerOptions extends WidgetOptions {
  /** Zoom control configuration */
  zoom?: {
    /** Minimum zoom level */
    min: number;
    /** Maximum zoom level */
    max: number;
    /** Zoom step size */
    step: number;
  };
  /** Pan control configuration */
  pan?: {
    /** Whether panning is enabled */
    enabled: boolean;
    /** Panning speed multiplier */
    speed: number;
  };
}

/**
 * Interactive flow visualization widget for MCP.
 * Displays resources and steps in a flow as an interactive SVG diagram.
 * Supports zooming, panning, and interactive elements.
 */
export class FlowViewerWidget extends MCPWidget {
  /** The flow being visualized */
  private flow: DeepFlow;
  /** SVG container for the flow diagram */
  private svgContainer: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  /** Tooltip element for displaying additional information */
  private tooltipElement: HTMLElement = document.createElement('div');
  /** Current zoom level */
  private zoomLevel: number = 1;
  /** Current horizontal pan position */
  private panX: number = 0;
  /** Current vertical pan position */
  private panY: number = 0;
  /** Whether the user is currently dragging the view */
  private isDragging: boolean = false;
  /** Last recorded mouse X position during drag */
  private lastMouseX: number = 0;
  /** Last recorded mouse Y position during drag */
  private lastMouseY: number = 0;

  /**
   * Creates a new FlowViewerWidget instance.
   * @param element - The target DOM element or its ID where the widget will be mounted
   * @param flow - The flow to visualize
   * @param options - Flow viewer configuration options
   */
  constructor(element: HTMLElement | string, flow: DeepFlow, options: FlowViewerOptions = {}) {
    super(element, null as any, {
      ...options,
      zoom: {
        min: 0.1,
        max: 2,
        step: 0.1,
        ...options.zoom
      },
      pan: {
        enabled: true,
        speed: 1,
        ...options.pan
      }
    });

    this.flow = flow;
    this.setupViewer();
  }

  /**
   * Sets up the flow viewer interface with SVG container, tooltip, and toolbar.
   * @private
   */
  private setupViewer(): void {
    // Create SVG container
    this.svgContainer.style.width = '100%';
    this.svgContainer.style.height = '100%';
    this.svgContainer.style.overflow = 'visible';

    // Create tooltip
    this.tooltipElement.className = 'flow-tooltip';
    this.tooltipElement.style.cssText = `
      position: absolute;
      display: none;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
    `;

    // Create toolbar
    const toolbar = this.createToolbar();

    // Add elements to container
    this.element.appendChild(toolbar);
    this.element.appendChild(this.svgContainer);
    this.element.appendChild(this.tooltipElement);

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Creates the toolbar with zoom and reset controls.
   * @returns The created toolbar element
   * @private
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.className = 'flow-toolbar';
    toolbar.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 8px;
      z-index: 1;
    `;

    const zoomIn = this.createToolbarButton('+', 'Zoom In');
    const zoomOut = this.createToolbarButton('-', 'Zoom Out');
    const reset = this.createToolbarButton('Reset', 'Reset View');

    zoomIn.addEventListener('click', () => this.zoom(1));
    zoomOut.addEventListener('click', () => this.zoom(-1));
    reset.addEventListener('click', () => this.resetView());

    toolbar.appendChild(zoomIn);
    toolbar.appendChild(zoomOut);
    toolbar.appendChild(reset);

    return toolbar;
  }

  /**
   * Creates a styled button for the toolbar.
   * @param text - Button text
   * @param title - Button tooltip text
   * @returns The created button element
   * @private
   */
  private createToolbarButton(text: string, title: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.style.cssText = `
      padding: 4px 8px;
      background: ${this.options.theme === 'dark' ? '#333' : '#f5f5f5'};
      color: ${this.options.theme === 'dark' ? '#fff' : '#333'};
      border: 1px solid ${this.options.theme === 'dark' ? '#555' : '#ddd'};
      border-radius: 4px;
      cursor: pointer;
    `;
    return button;
  }

  /**
   * Sets up event listeners for pan and zoom interactions.
   * @private
   */
  private setupEventListeners(): void {
    if ((this.options as FlowViewerOptions).pan?.enabled) {
      this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    }

    this.element.addEventListener('wheel', this.handleWheel.bind(this));
  }

  /**
   * Handles mouse down events for panning.
   * @param e - Mouse event
   * @private
   */
  private handleMouseDown(e: MouseEvent): void {
    if (e.button === 0) { // Left mouse button
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  }

  /**
   * Handles mouse move events for panning.
   * @param e - Mouse event
   * @private
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    const speed = (this.options as FlowViewerOptions).pan?.speed || 1;

    this.panX += dx * speed;
    this.panY += dy * speed;

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.updateTransform();
  }

  /**
   * Handles mouse up events to stop panning.
   * @private
   */
  private handleMouseUp(): void {
    this.isDragging = false;
  }

  /**
   * Handles mouse wheel events for zooming.
   * @param e - Wheel event
   * @private
   */
  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    this.zoom(delta);
  }

  /**
   * Adjusts the zoom level.
   * @param delta - Zoom delta (-1 for zoom out, 1 for zoom in)
   * @private
   */
  private zoom(delta: number): void {
    const options = this.options as FlowViewerOptions;
    const step = options.zoom?.step || 0.1;
    const min = options.zoom?.min || 0.1;
    const max = options.zoom?.max || 2;

    const newZoom = this.zoomLevel + (delta * step);
    if (newZoom >= min && newZoom <= max) {
      this.zoomLevel = newZoom;
      this.updateTransform();
    }
  }

  /**
   * Resets the view to default zoom and pan position.
   * @private
   */
  private resetView(): void {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  /**
   * Updates the SVG container transform based on current zoom and pan.
   * @private
   */
  private updateTransform(): void {
    this.svgContainer.style.transform = 
      `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
  }

  /**
   * Renders the flow viewer.
   * Implements the abstract render method from MCPWidget.
   */
  public render(): void {
    // Clear existing content
    while (this.svgContainer.firstChild) {
      this.svgContainer.removeChild(this.svgContainer.firstChild);
    }

    this.renderFlow();
  }

  /**
   * Renders the flow diagram with resources, steps, and connections.
   * @private
   */
  private renderFlow(): void {
    // Create nodes for resources
    const resourceNodes = this.flow.getResources().map((resource, index) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const x = 100;
      const y = 100 + (index * 100);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', '80');
      rect.setAttribute('height', '40');
      rect.setAttribute('rx', '5');
      rect.setAttribute('fill', this.options.theme === 'dark' ? '#333' : '#fff');
      rect.setAttribute('stroke', '#007bff');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (x + 40).toString());
      text.setAttribute('y', (y + 25).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', this.options.theme === 'dark' ? '#fff' : '#000');
      text.textContent = resource.id;

      g.appendChild(rect);
      g.appendChild(text);
      return { element: g, x: x + 40, y: y + 20, id: resource.id };
    });

    // Create nodes for steps
    const stepNodes = this.flow.getSteps().map((step, index) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const x = 300;
      const y = 100 + (index * 100);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', '100');
      rect.setAttribute('height', '50');
      rect.setAttribute('rx', '5');
      rect.setAttribute('fill', this.options.theme === 'dark' ? '#333' : '#fff');
      rect.setAttribute('stroke', '#28a745');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (x + 50).toString());
      text.setAttribute('y', (y + 30).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', this.options.theme === 'dark' ? '#fff' : '#000');
      text.textContent = step.id;

      g.appendChild(rect);
      g.appendChild(text);
      return { element: g, x: x + 50, y: y + 25, id: step.id };
    });

    // Add all nodes to SVG
    [...resourceNodes, ...stepNodes].forEach(node => {
      this.svgContainer.appendChild(node.element);
    });

    // Create connections
    this.flow.getSteps().forEach(step => {
      // Connect step to its resource
      const stepNode = stepNodes.find(n => n.id === step.id);
      const resourceNode = resourceNodes.find(n => n.id === step.action.resource);

      if (stepNode && resourceNode) {
        const path = this.createConnection(
          resourceNode.x + 40, resourceNode.y,
          stepNode.x - 50, stepNode.y
        );
        this.svgContainer.appendChild(path);
      }

      // Connect step to its dependencies
      step.dependencies.forEach(depId => {
        const depNode = stepNodes.find(n => n.id === depId);
        if (depNode && stepNode) {
          const path = this.createConnection(
            depNode.x, depNode.y + 25,
            stepNode.x, stepNode.y - 25
          );
          this.svgContainer.appendChild(path);
        }
      });
    });
  }

  /**
   * Creates a curved connection path between two points.
   * @param x1 - Start X coordinate
   * @param y1 - Start Y coordinate
   * @param x2 - End X coordinate
   * @param y2 - End Y coordinate
   * @returns SVG path element representing the connection
   * @private
   */
  private createConnection(x1: number, y1: number, x2: number, y2: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curve = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5;
    
    path.setAttribute('d', `
      M ${x1} ${y1}
      C ${x1 + curve} ${y1},
        ${x2 - curve} ${y2},
        ${x2} ${y2}
    `);
    
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', this.options.theme === 'dark' ? '#666' : '#999');
    path.setAttribute('stroke-width', '2');
    
    return path;
  }

  /**
   * Updates the flow being visualized and re-renders the diagram.
   * @param flow - The new flow to visualize
   */
  public updateFlow(flow: DeepFlow): void {
    this.flow = flow;
    this.render();
  }
}