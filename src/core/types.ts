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
  
  export interface ExecutionResult {
    success: boolean;
    data: any;
    proofs: string[];
  }
  
  export interface MCPConfig {
    apiKey: string;
    baseUrl: string;
    timeout?: number;
  }
  
  export interface IntentExecutionOptions {
    parameters?: Record<string, any>;
    timeout?: number;
  }

  export interface DeepIntent {
    intentId: string;
    rawIntent: string;
    mainGoal: Goal;
    subGoals: Goal[];
  }

  export interface Goal {
    id: string;
    objective: string;
    dependencies: string[];
    constraints: string[];
  }

  export interface DeepFlow {
    id: string;
    intent: string;
    metadata: Record<string, any>;
    resources: Resource[];
    steps: Step[];
  }

  export interface Resource {
    id: string;
    type: string;
    provider: string;
  }

  export interface Step {
    id: string;
    dependencies: string[];
    action: Action;
  }

  export interface Action {
    resource: string;
    query: string;
    output: string;
  }

  export interface Message {
    id: string;
    content: string;
    timestamp: string;
    sender: 'user' | 'assistant';
    metadata?: Record<string, any>;
  }

  export interface WidgetOptions {
    height?: string;
    width?: string;
    theme?: 'light' | 'dark';
    zoom?: {
      min: number;
      max: number;
      step: number;
    };
    pan?: {
      enabled: boolean;
      speed: number;
    };
  }