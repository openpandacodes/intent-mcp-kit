# Contributing to Intent MCP Kit

Thank you for your interest in contributing to the Intent MCP Kit! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [aby@helloaxes.com](mailto:aby@helloaxes.com).

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR-USERNAME/mcp-kit.git
cd mcp-kit
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/aintent/mcp-kit.git
```

4. Create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. Start the development server:
```bash
npm run dev
```

## Making Changes

1. Keep your changes focused and atomic
2. Follow the [Style Guide](#style-guide)
3. Write clear commit messages following conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code changes that neither fix bugs nor add features
- perf: Performance improvements
- test: Adding or modifying tests
- chore: Changes to build process or auxiliary tools

Example:
```
feat(chat): add message threading support

- Implement message thread data structure
- Add UI components for thread visualization
- Update documentation

Closes #123
```

## Testing

1. Write tests for new features:
```typescript
describe('ChatWidget', () => {
  it('should handle message threading', () => {
    const chat = new ChatWidget('#container', client);
    // Test implementation
  });
});
```

2. Run tests:
```bash
# Run all tests
npm test

# Run specific tests
npm test -- --grep "ChatWidget"

# Run tests in watch mode
npm test -- --watch
```

3. Check code coverage:
```bash
npm run coverage
```

## Documentation

1. Update relevant documentation for your changes
2. Follow the documentation style guide:
   - Use clear, concise language
   - Include code examples
   - Add TypeScript types and interfaces
   - Document breaking changes
   - Update version numbers

3. Build and test documentation:
```bash
npm run docs
```

## Pull Request Process

1. Update your fork:
```bash
git fetch upstream
git rebase upstream/main
```

2. Push your changes:
```bash
git push origin feature/your-feature-name
```

3. Create a pull request:
   - Use a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes
   - Update documentation

4. Address review feedback:
   - Make requested changes
   - Push updates to your branch
   - Respond to comments
   - Request re-review when ready

5. Merge requirements:
   - Passing CI/CD checks
   - Approved code review
   - Updated documentation
   - No merge conflicts

## Style Guide

### TypeScript

```typescript
// Use interfaces for public APIs
interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Use type for unions and complex types
type MessageStatus = 'sent' | 'delivered' | 'read';

// Use classes for widgets and components
class ChatWidget extends MCPWidget {
  private messages: ChatMessage[] = [];
  
  constructor(
    element: HTMLElement | string,
    client: MCPClient,
    options?: ChatWidgetOptions
  ) {
    super(element, client, options);
  }
  
  // Public methods first
  public addMessage(message: ChatMessage): void {
    this.messages.push(message);
    this.render();
  }
  
  // Protected methods next
  protected render(): void {
    // Implementation
  }
  
  // Private methods last
  private validateMessage(message: ChatMessage): boolean {
    return message.content.length > 0;
  }
}
```

### CSS

```css
/* Use BEM naming convention */
.chat-widget {
  /* Base styles */
}

.chat-widget__message {
  /* Element styles */
}

.chat-widget__message--highlighted {
  /* Modifier styles */
}

/* Use CSS variables for theming */
:root {
  --mcp-primary-color: #007bff;
}

/* Mobile-first responsive design */
@media (min-width: 768px) {
  .chat-widget {
    /* Desktop styles */
  }
}
```

### HTML

```html
<!-- Use semantic HTML -->
<div class="chat-widget">
  <header class="chat-widget__header">
    <h2>Chat</h2>
  </header>
  
  <main class="chat-widget__messages">
    <!-- Messages container -->
  </main>
  
  <footer class="chat-widget__input">
    <input type="text" aria-label="Message input">
    <button type="submit">Send</button>
  </footer>
</div>
```

## Community

- Follow [@aintent_](https://twitter.com/aintent_) on Twitter
- Join our [Discord community](https://discord.gg/aintent)
- Read our [blog](https://aintent.ai/blog)
- Report issues on [GitHub](https://github.com/aintent/mcp-kit/issues)
- Contact us at [aby@helloaxes.com](mailto:aby@helloaxes.com)

## License

By contributing to Intent MCP Kit, you agree that your contributions will be licensed under its MIT license. 