import { MCPWidget } from './base';
import { MCPClient, Message } from '../core';

/**
 * Configuration options for the ChatWidget.
 */
interface ChatWidgetOptions {
  /** Widget height (CSS value) */
  height?: string;
  /** Widget width (CSS value) */
  width?: string;
  /** Widget theme ('light' or 'dark') */
  theme?: 'light' | 'dark';
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Maximum number of messages to keep in history */
  maxMessages?: number;
  /** Whether to automatically scroll to new messages */
  autoScroll?: boolean;
}

/**
 * Interactive chat widget for MCP that allows users to send messages and receive responses.
 * Extends the base MCPWidget class with chat-specific functionality.
 */
export class ChatWidget extends MCPWidget {
  /** Array of chat messages */
  private messages: Message[] = [];
  /** Container element for chat messages */
  private chatContainer: HTMLElement = document.createElement('div');
  /** Container element for input field and send button */
  private inputContainer: HTMLElement = document.createElement('div');
  /** Flag indicating whether a message is being processed */
  private isProcessing: boolean = false;

  /**
   * Creates a new ChatWidget instance.
   * @param element - The target DOM element or its ID where the widget will be mounted
   * @param client - The MCP client instance for API interactions
   * @param options - Chat widget configuration options
   */
  constructor(element: HTMLElement | string, client: MCPClient, options: ChatWidgetOptions = {}) {
    super(element, client, options);
    this.element.classList.add('mcp-chat-widget');
    this.setupChatContainer();
  }

  /**
   * Sets up the chat interface with message container and input field.
   * @private
   */
  private setupChatContainer(): void {
    // Create chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'chat-messages';
    this.chatContainer.style.cssText = `
      height: calc(100% - 60px);
      overflow-y: auto;
      padding: 20px;
    `;

    // Create input container
    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'chat-input';
    this.inputContainer.style.cssText = `
      height: 60px;
      padding: 10px;
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
    `;

    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = (this.options as ChatWidgetOptions).placeholder || 'Type your message...';
    input.style.cssText = `
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 10px;
    `;

    // Create send button
    const button = document.createElement('button');
    button.textContent = 'Send';
    button.style.cssText = `
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // Add event listeners
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isProcessing) {
        this.sendMessage(input.value);
        input.value = '';
      }
    });

    button.addEventListener('click', () => {
      if (!this.isProcessing && input.value.trim()) {
        this.sendMessage(input.value);
        input.value = '';
      }
    });

    // Assemble the widget
    this.inputContainer.appendChild(input);
    this.inputContainer.appendChild(button);
    this.element.appendChild(this.chatContainer);
    this.element.appendChild(this.inputContainer);
  }

  /**
   * Sends a message and processes it through the MCP client.
   * @param content - The message content to send
   * @private
   */
  private async sendMessage(content: string): Promise<void> {
    if (!content.trim() || this.isProcessing) return;

    try {
      this.isProcessing = true;
      this.showLoading();

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
        sender: 'user'
      };
      this.addMessage(userMessage);

      // Process the message using the client
      const intent = await this.client.processIntent(content);
      const flows = await this.client.generateWorkflows(intent);
      
      if (flows.length > 0) {
        const result = await this.client.executeWorkflow(flows[0]);
        
        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.success 
            ? `I've processed your request: ${content}\nResult: ${JSON.stringify(result.data, null, 2)}`
            : 'I apologize, but I was unable to process your request.',
          timestamp: new Date().toISOString(),
          sender: 'assistant',
          metadata: { result }
        };
        this.addMessage(assistantMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.element.appendChild(this.createErrorElement(errorMessage));
    } finally {
      this.isProcessing = false;
      this.hideLoading();
    }
  }

  /**
   * Adds a message to the chat history.
   * @param message - The message to add
   * @private
   */
  private addMessage(message: Message): void {
    this.messages.push(message);

    // Apply message limit if specified
    const maxMessages = (this.options as ChatWidgetOptions).maxMessages;
    if (maxMessages && this.messages.length > maxMessages) {
      this.messages = this.messages.slice(-maxMessages);
    }

    this.renderMessages();
  }

  /**
   * Renders all messages in the chat container.
   * @private
   */
  private renderMessages(): void {
    this.chatContainer.innerHTML = this.messages
      .map(msg => `
        <div class="chat-message ${msg.sender}" style="
          margin: 10px 0;
          padding: 10px;
          border-radius: 4px;
          max-width: 80%;
          ${msg.sender === 'user' ? 'margin-left: auto; background: #007bff; color: white;' : 'background: #f1f1f1;'}
        ">
          <div class="message-content">${this.escapeHtml(msg.content)}</div>
          <div class="message-timestamp" style="font-size: 0.8em; opacity: 0.7;">
            ${new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      `)
      .join('');

    // Auto scroll to bottom if enabled
    if ((this.options as ChatWidgetOptions).autoScroll !== false) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }

  /**
   * Escapes HTML characters in a string to prevent XSS.
   * @param html - The string to escape
   * @returns The escaped string
   * @private
   */
  private escapeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Renders the chat widget.
   * Implements the abstract render method from MCPWidget.
   */
  public render(): void {
    this.renderMessages();
  }

  /**
   * Clears all messages from the chat history.
   */
  public clearMessages(): void {
    this.messages = [];
    this.renderMessages();
  }

  /**
   * Gets a copy of the current message history.
   * @returns Array of messages
   */
  public getMessages(): Message[] {
    return [...this.messages];
  }
}