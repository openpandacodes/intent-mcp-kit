import { MCPConfig, ExecutionResult, DeepIntent, DeepFlow } from './types';

export class MCPClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: MCPConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000; // Default 30s timeout
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to connect to MCP server');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Connection failed: ${errorMessage}`);
    }
  }

  async processIntent(intent: string): Promise<DeepIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/intent/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intent })
      });

      if (!response.ok) {
        throw new Error('Failed to process intent');
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Intent processing failed: ${errorMessage}`);
    }
  }

  async generateWorkflows(intent: DeepIntent): Promise<DeepFlow[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intent })
      });

      if (!response.ok) {
        throw new Error('Failed to generate workflows');
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Workflow generation failed: ${errorMessage}`);
    }
  }

  async executeWorkflow(flow: DeepFlow): Promise<ExecutionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flow })
      });

      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Workflow execution failed: ${errorMessage}`);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
}