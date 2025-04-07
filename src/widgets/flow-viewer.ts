// src/widgets/flow-viewer.ts
import { DeepFlow, Resource, Step, WidgetOptions } from '../core/types';

export class FlowViewerWidget {
  private element: HTMLElement;
  private flow: DeepFlow;
  private options: WidgetOptions;
  private svgElement: SVGElement;
  private tooltipElement: HTMLElement;
  private container: HTMLElement;
  private zoomLevel: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  constructor(element: HTMLElement | string, flow: DeepFlow, options: WidgetOptions = {}) {
    // Get or create container element
    this.element = typeof element === 'string' 
      ? document.getElementById(element) || document.createElement('div') 
      : element;
    
    this.flow = flow;
    this.options = {
      height: '500px',
      width: '100%',
      theme: 'light',
      zoom: {
        min: 0.1,
        max: 2,
        step: 0.1
      },
      pan: {
        enabled: true,
        speed: 1
      },
      ...options
    };
    
    // Create container
    this.container = document.createElement('div');
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    
    // Create SVG element for visualization
    this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgElement.style.width = '100%';
    this.svgElement.style.height = '100%';
    this.svgElement.style.overflow = 'visible';
    
    // Create tooltip element
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'mcp-flow-tooltip';
    this.tooltipElement.style.position = 'absolute';
    this.tooltipElement.style.display = 'none';
    this.tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.tooltipElement.style.color = 'white';
    this.tooltipElement.style.padding = '8px 12px';
    this.tooltipElement.style.borderRadius = '4px';
    this.tooltipElement.style.fontSize = '14px';
    this.tooltipElement.style.zIndex = '1000';
    this.tooltipElement.style.pointerEvents = 'none';
    
    // Set up the widget UI
    this.setupUI();
    
    // Add event listeners
    this.setupEventListeners();
  }

  private setupUI(): void {
    // Apply styles to container
    this.element.className = 'mcp-flow-viewer';
    this.element.style.position = 'relative';
    this.element.style.height = this.options.height || '500px';
    this.element.style.width = this.options.width || '100%';
    this.element.style.overflow = 'hidden';
    this.element.style.border = '1px solid #e0e0e0';
    this.element.style.borderRadius = '8px';
    this.element.style.backgroundColor = this.options.theme === 'dark' ? '#1e1e1e' : '#ffffff';
    
    // Append elements to container
    this.container.appendChild(this.svgElement);
    this.element.appendChild(this.container);
    this.element.appendChild(this.tooltipElement);
    
    // Add toolbar
    this.setupToolbar();
  }

  private setupToolbar(): void {
    const toolbar = document.createElement('div');
    toolbar.className = 'mcp-flow-toolbar';
    toolbar.style.position = 'absolute';
    toolbar.style.top = '10px';
    toolbar.style.right = '10px';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.zIndex = '1001';
    
    // Zoom controls
    const zoomInButton = this.createToolbarButton('+', 'Zoom In');
    const zoomOutButton = this.createToolbarButton('-', 'Zoom Out');
    const resetButton = this.createToolbarButton('Reset', 'Reset View');
    
    zoomInButton.addEventListener('click', () => this.zoomIn());
    zoomOutButton.addEventListener('click', () => this.zoomOut());
    resetButton.addEventListener('click', () => this.resetView());
    
    toolbar.appendChild(zoomInButton);
    toolbar.appendChild(zoomOutButton);
    toolbar.appendChild(resetButton);
    
    this.element.appendChild(toolbar);
  }

  private createToolbarButton(text: string, title: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.title = title;
    button.style.padding = '4px 8px';
    button.style.background = this.options.theme === 'dark' ? '#333' : '#f5f5f5';
    button.style.color = this.options.theme === 'dark' ? '#fff' : '#333';
    button.style.border = '1px solid ' + (this.options.theme === 'dark' ? '#555' : '#ddd');
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.fontFamily = 'Arial, sans-serif';
    return button;
  }

  private setupEventListeners(): void {
    // Mouse events for panning
    if (this.options.pan.enabled) {
      this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
      this.container.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
    }

    // Wheel event for zooming
    this.container.addEventListener('wheel', (e) => this.handleWheel(e));
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button === 0) { // Left mouse button
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      e.preventDefault();
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;
      
      this.panX += deltaX * this.zoomLevel;
      this.panY += deltaY * this.zoomLevel;
      
      this.updateTransform();
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  }

  private handleMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this.isDragging = false;
    }
  }

  private handleMouseLeave(e: MouseEvent): void {
    this.isDragging = false;
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    this.zoom(delta);
  }

  private zoom(delta: number): void {
    const currentZoom = parseFloat(this.svgElement.style.transform.split('scale(')[1]?.split(')')[0] || '1');
    const newZoom = currentZoom + (delta * this.options.zoom.step);
    
    if (newZoom >= this.options.zoom.min && newZoom <= this.options.zoom.max) {
      this.zoomLevel = newZoom;
      this.updateTransform();
    }
  }

  private zoomIn(): void {
    this.zoom(1);
  }

  private zoomOut(): void {
    this.zoom(-1);
  }

  private resetView(): void {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
    this.render
  }

  private updateTransform(): void {
    this.container.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
  }

  private render(): void {
    // Clear existing visualization
    while (this.svgElement.firstChild) {
      this.svgElement.removeChild(this.svgElement.firstChild);
    }

    // Create title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '20');
    title.setAttribute('y', '30');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', this.options.theme === 'dark' ? '#ffffff' : '#333333');
    title.textContent = `DeepFlow: ${this.flow.id}`;
    this.svgElement.appendChild(title);

    // Create nodes for resources and steps
    const resourceNodes = this.createResourceNodes();
    const stepNodes = this.createStepNodes();

    // Add nodes to SVG
    resourceNodes.forEach(node => this.svgElement.appendChild(node));
    stepNodes.forEach(node => this.svgElement.appendChild(node));

    // Add connections between nodes
    this.createConnections(resourceNodes, stepNodes);
  }

  private createResourceNodes(): SVGElement[] {
    const nodes: SVGElement[] = [];
    const resources = this.flow.resources || [];
    
    const resourceWidth = 200;
    const resourceHeight = 60;
    const resourceGap = 40;
    const resourceY = 80;

    resources.forEach((resource, index) => {
      const x = 100 + index * (resourceWidth + resourceGap);
      const y = resourceY;

      const node = this.createResourceNode(resource, x, y);
      nodes.push(node);
    });

    return nodes;
  }

  private createStepNodes(): SVGElement[] {
    const nodes: SVGElement[] = [];
    const steps = this.flow.steps || [];
    
    const stepWidth = 200;
    const stepHeight = 80;
    const stepGap = 40;
    const layerGap = 120;
    const startY = 160;

    // Organize steps into layers based on dependencies
    const layers: Step[][] = [];
    const stepMap: Record<string, Step> = {};

    steps.forEach(step => {
      stepMap[step.id] = step;
    });

    // Function to get all dependencies for a step
    const getDependencies = (step: Step): string[] => {
      if (!step.depends || step.depends === '') return [];
      return step.depends.split(',').map(d => d.trim());
    };

    // Function to calculate layer for a step
    const calculateLayer = (step: Step, visited: Set<string> = new Set()): number => {
      if (visited.has(step.id)) {
        return 0;
      }
      
      visited.add(step.id);
      const dependencies = getDependencies(step);
      
      if (dependencies.length === 0) {
        return 0;
      }
      
      let maxLayer = 0;
      for (const depId of dependencies) {
        const depStep = stepMap[depId];
        if (depStep) {
          const depLayer = calculateLayer(depStep, new Set(visited));
          maxLayer = Math.max(maxLayer, depLayer + 1);
        }
      }
      
      return maxLayer;
    };

    // Calculate layer for each step
    steps.forEach(step => {
      const layer = calculateLayer(step);
      if (!layers[layer]) layers[layer] = [];
      layers[layer].push(step);
    });

    // Place steps in layers
    layers.forEach((layerSteps, layerIndex) => {
      const y = startY + layerIndex * (stepHeight + layerGap);
      const totalWidth = layerSteps.length * stepWidth + (layerSteps.length - 1) * stepGap;
      const startX = (this.svgElement.clientWidth - totalWidth) / 2;
      
      layerSteps.forEach((step, stepIndex) => {
        const x = startX + stepIndex * (stepWidth + stepGap);
        const node = this.createStepNode(step, x, y);
        nodes.push(node);
      });
    });

    return nodes;
  }

  private createResourceNode(resource: Resource, x: number, y: number): SVGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${x}, ${y})`);
    
    // Create resource node
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '180');
    rect.setAttribute('height', '60');
    rect.setAttribute('rx', '8');
    rect.setAttribute('ry', '8');
    rect.setAttribute('fill', '#e3f2fd');
    rect.setAttribute('stroke', '#90caf9');
    rect.setAttribute('stroke-width', '2');
    
    // Add resource ID
    const idText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    idText.setAttribute('x', '10');
    idText.setAttribute('y', '25');
    idText.setAttribute('font-size', '14');
    idText.setAttribute('font-weight', 'bold');
    idText.setAttribute('fill', '#1976d2');
    idText.textContent = resource.id;
    
    // Add resource type
    const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    typeText.setAttribute('x', '10');
    typeText.setAttribute('y', '45');
    typeText.setAttribute('font-size', '12');
    typeText.setAttribute('fill', '#616161');
    typeText.textContent = `${resource.type} (${resource.provider})`;
    
    // Add elements to group
    group.appendChild(rect);
    group.appendChild(idText);
    group.appendChild(typeText);
    
    return group;
  }

  private createStepNode(step: Step, x: number, y: number): SVGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${x}, ${y})`);
    
    // Create step node
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '200');
    rect.setAttribute('height', '80');
    rect.setAttribute('rx', '8');
    rect.setAttribute('ry', '8');
    rect.setAttribute('fill', '#e8f5e9');
    rect.setAttribute('stroke', '#a5d6a7');
    rect.setAttribute('stroke-width', '2');
    
    // Add step ID
    const idText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    idText.setAttribute('x', '10');
    idText.setAttribute('y', '25');
    idText.setAttribute('font-size', '14');
    idText.setAttribute('font-weight', 'bold');
    idText.setAttribute('fill', '#2e7d32');
    idText.textContent = step.id;
    
    // Add resource reference
    const resourceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    resourceText.setAttribute('x', '10');
    resourceText.setAttribute('y', '45');
    resourceText.setAttribute('font-size', '12');