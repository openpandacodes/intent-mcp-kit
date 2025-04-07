import { MCPClient, WidgetOptions } from '../core';

/**
 * Abstract base class for MCP widgets.
 * Provides common functionality for widget initialization, rendering, and management.
 */
export abstract class MCPWidget {
  /** The DOM element containing the widget */
  protected element: HTMLElement;
  /** Reference to the MCP client for API interactions */
  protected client: MCPClient;
  /** Widget configuration options */
  protected options: WidgetOptions;

  /**
   * Creates a new MCPWidget instance.
   * @param element - The target DOM element or its ID where the widget will be mounted
   * @param client - The MCP client instance for API interactions
   * @param options - Widget configuration options
   */
  constructor(element: HTMLElement | string, client: MCPClient, options: WidgetOptions = {}) {
    // Get or create container element
    this.element = typeof element === 'string' 
      ? document.getElementById(element) || document.createElement('div') 
      : element;
    
    this.client = client;
    this.options = {
      height: '500px',
      width: '100%',
      theme: 'light',
      ...options
    };

    this.initialize();
  }

  /**
   * Initializes the widget with base styles and configuration.
   * Called automatically by the constructor.
   * @protected
   */
  protected initialize(): void {
    // Apply base styles
    this.element.style.height = this.options.height || '500px';
    this.element.style.width = this.options.width || '100%';
    this.element.classList.add('mcp-widget', this.options.theme || 'light');
  }

  /**
   * Renders the widget content.
   * Must be implemented by child classes.
   */
  public abstract render(): void;

  /**
   * Destroys the widget and removes it from the DOM.
   * Cleans up event listeners and resources.
   */
  public destroy(): void {
    // Clean up event listeners and remove element
    this.element.remove();
  }

  /**
   * Creates an error message element with the specified message.
   * @param message - The error message to display
   * @returns The created error element
   * @protected
   */
  protected createErrorElement(message: string): HTMLElement {
    const errorElement = document.createElement('div');
    errorElement.className = 'mcp-widget-error';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.padding = '10px';
    return errorElement;
  }

  /**
   * Shows a loading spinner in the widget.
   * @protected
   */
  protected showLoading(): void {
    const loader = document.createElement('div');
    loader.className = 'mcp-widget-loader';
    loader.innerHTML = `
      <div class="spinner"></div>
      <style>
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    this.element.appendChild(loader);
  }

  /**
   * Hides the loading spinner if it exists.
   * @protected
   */
  protected hideLoading(): void {
    const loader = this.element.querySelector('.mcp-widget-loader');
    if (loader) {
      loader.remove();
    }
  }

  /**
   * Sets the widget theme.
   * @param theme - The theme to apply ('light' or 'dark')
   * @protected
   */
  protected setTheme(theme: 'light' | 'dark'): void {
    this.element.classList.remove('light', 'dark');
    this.element.classList.add(theme);
    this.options.theme = theme;
  }

  /**
   * Gets the widget's DOM element.
   * @returns The widget's DOM element
   */
  public getElement(): HTMLElement {
    return this.element;
  }
} 