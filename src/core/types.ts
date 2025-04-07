export interface Intent {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface MCPResponse {
    success: boolean;
    data: any;
    error?: string;
  }
  
  export interface MCPConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
  }
  
  export interface IntentExecutionOptions {
    parameters?: Record<string, any>;
    timeout?: number;
  }