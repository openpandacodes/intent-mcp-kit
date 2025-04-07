import { Intent, MCPResponse } from '../core/types';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'assistant';
  metadata?: Record<string, any>;
}

export interface ChatConfig {
  clientId: string;
  theme?: 'light' | 'dark';
  onMessage?: (message: ChatMessage) => void;
  maxMessages?: number;
  rateLimit?: number; // messages per minute
}

export class ChatWidget {
  private container: HTMLElement;
  private config: ChatConfig;
  private messages: ChatMessage[] = [];
  private lastMessageTime: number = 0;
  private messageQueue: string[] = [];
  private isProcessing: boolean = false;

  constructor(config: ChatConfig) {
    this.validateConfig(config);
    this.config = config;
    this.initialize();
  }

  private validateConfig(config: ChatConfig): void {
    if (!config.clientId) {
      throw new Error('clientId is required');
    }
    if (config.maxMessages && config.maxMessages < 1) {
      throw new Error('maxMessages must be greater than 0');
    }
    if (config.rateLimit && (config.rateLimit < 1 || config.rateLimit > 100)) {
      throw new Error('rateLimit must be between 1 and 100');
    }
  }

  private initialize(): void {
    const container = document.createElement('div');
    container.className = `intent-chat-widget ${this.config.theme || 'light'}`;
    container.innerHTML = `
      <div class="chat-header">
        <h3>Intent Chat</h3>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input">
        <input type="text" placeholder="Type your message..." id="chat-input">
        <button id="send-button">Send</button>
      </div>
    `;
    this.container = container;

    // Initialize event listeners with cleanup
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const input = this.container.querySelector('#chat-input');
    const button = this.container.querySelector('#send-button');
    const messagesContainer = this.container.querySelector('.chat-messages');

    if (input && button && messagesContainer) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage(input.value);
        }
      });

      button.addEventListener('click', () => {
        this.sendMessage(input.value);
      });

      // Cleanup listeners when destroyed
      this.container.addEventListener('destroy', () => {
        input.removeEventListener('keypress');
        button.removeEventListener('click');
      });
    }
  }

  private async sendMessage(message: string): Promise<void> {
    if (!message || message.trim() === '') {
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (this.config.rateLimit && this.lastMessageTime) {
      const minInterval = 60000 / this.config.rateLimit;
      if (now - this.lastMessageTime < minInterval) {
        return;
      }
    }

    // Add to queue if processing
    if (this.isProcessing) {
      this.messageQueue.push(message);
      return;
    }

    try {
      this.isProcessing = true;
      this.lastMessageTime = now;

      // Create user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toISOString(),
        sender: 'user'
      };

      // Add to messages
      this.messages.push(userMessage);
      this.renderMessages();

      // Send to server
      const response = await this.processMessage(message);
      if (response.success && response.data) {
        // Create assistant message
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response.data.response,
          timestamp: new Date().toISOString(),
          sender: 'assistant',
          metadata: response.data.metadata
        };

        this.messages.push(assistantMessage);
        this.renderMessages();
      }

      // Process queue
      if (this.messageQueue.length > 0) {
        this.sendMessage(this.messageQueue.shift()!);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMessage(message: string): Promise<MCPResponse> {
    // Implementation using MCPClient
    return {
      success: true,
      data: {
        response: 'This is a mock response'
      }
    };
  }

  private renderMessages(): void {
    const messagesContainer = this.container.querySelector('.chat-messages');
    if (!messagesContainer) return;

    // Apply max messages limit
    if (this.config.maxMessages && this.messages.length > this.config.maxMessages) {
      this.messages = this.messages.slice(-this.config.maxMessages);
    }

    messagesContainer.innerHTML = this.messages
      .map((msg) => `
        <div class="message ${msg.sender}">
          <div class="message-content">${msg.content}</div>
          <div class="message-timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</div>
        </div>
      `)
      .join('');

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  public render(target: HTMLElement): void {
    if (!target) {
      throw new Error('Target element is required');
    }
    target.appendChild(this.container);
  }

  public destroy(): void {
    this.container.dispatchEvent(new Event('destroy'));
    this.container.remove();
  }
}