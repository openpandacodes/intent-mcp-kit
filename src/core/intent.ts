import { Intent, MCPResponse, Goal } from './types';
import { MCPClient } from './client';

export class IntentProcessor {
  private client: MCPClient;

  constructor(client: MCPClient) {
    this.client = client;
  }

  public async processIntent(intentId: string, parameters: Record<string, any> = {}): Promise<MCPResponse> {
    try {
      const intentResponse = await this.client.getIntent(intentId);
      if (!intentResponse.success) {
        return intentResponse;
      }

      const executionResponse = await this.client.executeIntent(intentId, { parameters });
      return executionResponse;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async getIntentDetails(intentId: string): Promise<MCPResponse> {
    return this.client.getIntent(intentId);
  }

  public async listAvailableIntents(): Promise<MCPResponse> {
    return this.client.listIntents();
  }

  public async createNewIntent(intent: Record<string, any>): Promise<MCPResponse> {
    return this.client.createIntent(intent);
  }

  public async updateExistingIntent(intentId: string, intent: Record<string, any>): Promise<MCPResponse> {
    return this.client.updateIntent(intentId, intent);
  }

  public async deleteIntent(intentId: string): Promise<MCPResponse> {
    return this.client.deleteIntent(intentId);
  }

  public async executeIntentWithRetry(intentId: string, options: Record<string, any> = {}, maxRetries: number = 3): Promise<MCPResponse> {
    let retries = 0;
    let lastError: string | undefined;

    while (retries < maxRetries) {
      try {
        const response = await this.client.executeIntent(intentId, options);
        if (response.success) {
          return response;
        }
        lastError = response.error;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error occurred';
      }

      retries++;
      await new Promise(resolve => setTimeout(resolve, retries * 1000)); // Exponential backoff
    }

    return {
      success: false,
      data: null,
      error: `Failed after ${maxRetries} attempts: ${lastError}`
    };
  }
}

export class DeepIntent {
  private intentId: string;
  private rawIntent: string;
  private mainGoal: Goal;
  private subGoals: Goal[];

  constructor(intentId: string, rawIntent: string, mainGoal: Goal, subGoals: Goal[] = []) {
    this.intentId = intentId;
    this.rawIntent = rawIntent;
    this.mainGoal = mainGoal;
    this.subGoals = subGoals;
  }

  public getIntentId(): string {
    return this.intentId;
  }

  public getRawIntent(): string {
    return this.rawIntent;
  }

  public getMainGoal(): Goal {
    return { ...this.mainGoal };
  }

  public getSubGoals(): Goal[] {
    return [...this.subGoals];
  }

  public addSubGoal(goal: Goal): void {
    this.subGoals.push(goal);
  }

  public removeSubGoal(goalId: string): void {
    this.subGoals = this.subGoals.filter(goal => goal.id !== goalId);
  }

  public toJSON(): object {
    return {
      intentId: this.intentId,
      rawIntent: this.rawIntent,
      mainGoal: this.mainGoal,
      subGoals: this.subGoals
    };
  }

  public static fromJSON(data: any): DeepIntent {
    if (!data.intentId || !data.rawIntent || !data.mainGoal) {
      throw new Error('Invalid DeepIntent data');
    }

    return new DeepIntent(
      data.intentId,
      data.rawIntent,
      data.mainGoal,
      data.subGoals || []
    );
  }
}