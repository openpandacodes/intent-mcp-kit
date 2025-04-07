import { ChatWidget } from '../../src/widgets/chat';
import { MCPClient } from '../../src/core/client';

describe('ChatWidget', () => {
  let chatWidget: ChatWidget;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    chatWidget = new ChatWidget({
      clientId: 'test-client',
      theme: 'light',
      maxMessages: 100,
      rateLimit: 10
    });
  });

  describe('initialization', () => {
    it('should create a chat widget with default options', () => {
      expect(chatWidget).toBeDefined();
      chatWidget.render(mockContainer);
      expect(mockContainer.querySelector('.intent-chat-widget')).toBeTruthy();
    });

    it('should apply custom options', () => {
      const customWidget = new ChatWidget({
        clientId: 'test-client',
        theme: 'dark',
        maxMessages: 50,
        rateLimit: 5
      });
      expect(customWidget).toBeDefined();
    });
  });

  describe('rendering', () => {
    it('should render the chat widget', () => {
      chatWidget.render(mockContainer);
      expect(mockContainer.querySelector('.chat-header')).toBeTruthy();
      expect(mockContainer.querySelector('.chat-messages')).toBeTruthy();
      expect(mockContainer.querySelector('.chat-input')).toBeTruthy();
    });

    it('should handle destruction', () => {
      chatWidget.render(mockContainer);
      chatWidget.destroy();
      expect(mockContainer.querySelector('.intent-chat-widget')).toBeFalsy();
    });
  });
}); 