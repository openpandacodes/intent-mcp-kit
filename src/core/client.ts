import { MCPConfig, MCPResponse, IntentExecutionOptions } from './types';

export class MCPClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(config: MCPConfig) {
    this.validateConfig(config);
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
  }

  private validateConfig(config: MCPConfig): void {
    if (!config.baseUrl.startsWith('http')) {
      throw new Error('baseUrl must be a valid URL');
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }
    if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
      throw new Error('timeout must be between 1000ms and 60000ms');
    }
  }

  private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any): Promise<MCPResponse> {
    if (!endpoint.startsWith('/')) {
      throw new Error('Endpoint must start with /');
    }

    if ((method === 'POST' || method === 'PUT') && !body) {
      throw new Error('Body is required for POST/PUT requests');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        error: undefined
      };
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error) {
        return {
          success: false,
          data: null,
          error: error.message
        };
      }
      return {
        success: false,
        data: null,
        error: 'Unknown error occurred'
      };
    } finally {
      clearTimeout(id);
    }
  }

  public async getIntent(id: string): Promise<MCPResponse> {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent ID'
      };
    }
    return this.makeRequest(`/intents/${id}`, 'GET');
  }

  public async executeIntent(id: string, options: IntentExecutionOptions = {}): Promise<MCPResponse> {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent ID'
      };
    }
    return this.makeRequest(`/intents/${id}/execute`, 'POST', options);
  }

  public async listIntents(): Promise<MCPResponse> {
    return this.makeRequest('/intents', 'GET');
  }

  public async createIntent(intent: Record<string, any>): Promise<MCPResponse> {
    if (!intent || typeof intent !== 'object') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent data'
      };
    }
    return this.makeRequest('/intents', 'POST', intent);
  }

  public async updateIntent(id: string, intent: Record<string, any>): Promise<MCPResponse> {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent ID'
      };
    }
    if (!intent || typeof intent !== 'object') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent data'
      };
    }
    return this.makeRequest(`/intents/${id}`, 'PUT', intent);
  }

  public async deleteIntent(id: string): Promise<MCPResponse> {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        data: null,
        error: 'Invalid intent ID'
      };
    }
    return this.makeRequest(`/intents/${id}`, 'DELETE');
  }
}