import { Resource, Step, ExecutionResult } from './types';

export class DeepFlow {
  private id: string;
  private intent: string;
  private metadata: Record<string, any>;
  private resources: Resource[];
  private steps: Step[];

  constructor(
    id: string,
    intent: string,
    metadata: Record<string, any> = {},
    resources: Resource[] = [],
    steps: Step[] = []
  ) {
    this.id = id;
    this.intent = intent;
    this.metadata = metadata;
    this.resources = resources;
    this.steps = steps;
  }

  public getId(): string {
    return this.id;
  }

  public getIntent(): string {
    return this.intent;
  }

  public getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  public getResources(): Resource[] {
    return [...this.resources];
  }

  public getSteps(): Step[] {
    return [...this.steps];
  }

  public addResource(resource: Resource): void {
    this.resources.push(resource);
  }

  public removeResource(resourceId: string): void {
    this.resources = this.resources.filter(resource => resource.id !== resourceId);
    // Remove steps that depend on this resource
    this.steps = this.steps.filter(step => step.action.resource !== resourceId);
  }

  public addStep(step: Step): void {
    // Validate that the step's resource exists
    if (!this.resources.some(resource => resource.id === step.action.resource)) {
      throw new Error(`Resource ${step.action.resource} not found in flow`);
    }
    // Validate that all dependencies exist
    for (const depId of step.dependencies) {
      if (!this.steps.some(s => s.id === depId)) {
        throw new Error(`Dependency step ${depId} not found in flow`);
      }
    }
    this.steps.push(step);
  }

  public removeStep(stepId: string): void {
    // Remove the step and update dependencies
    this.steps = this.steps.filter(step => {
      if (step.id === stepId) return false;
      step.dependencies = step.dependencies.filter(dep => dep !== stepId);
      return true;
    });
  }

  public updateMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }

  public async execute(): Promise<ExecutionResult> {
    try {
      // Validate flow before execution
      this.validate();

      // Execute steps in dependency order
      const executed = new Set<string>();
      const results: any[] = [];

      while (executed.size < this.steps.length) {
        const readySteps = this.steps.filter(step => 
          !executed.has(step.id) && 
          step.dependencies.every(dep => executed.has(dep))
        );

        if (readySteps.length === 0 && executed.size < this.steps.length) {
          throw new Error('Circular dependency detected in flow');
        }

        // Execute ready steps in parallel
        const stepResults = await Promise.all(
          readySteps.map(async step => {
            const result = await this.executeStep(step);
            executed.add(step.id);
            return { stepId: step.id, result };
          })
        );

        results.push(...stepResults);
      }

      return {
        success: true,
        data: results,
        proofs: results.map(r => `Step ${r.stepId} executed successfully`)
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        data: null,
        proofs: [`Flow execution failed: ${errorMessage}`]
      };
    }
  }

  private async executeStep(step: Step): Promise<any> {
    // This is a placeholder for actual step execution logic
    // In a real implementation, this would interact with the resource
    // specified in step.action
    return {
      resourceId: step.action.resource,
      query: step.action.query,
      output: step.action.output
    };
  }

  private validate(): void {
    // Validate resources
    const resourceIds = new Set(this.resources.map(r => r.id));
    if (resourceIds.size !== this.resources.length) {
      throw new Error('Duplicate resource IDs found');
    }

    // Validate steps
    const stepIds = new Set(this.steps.map(s => s.id));
    if (stepIds.size !== this.steps.length) {
      throw new Error('Duplicate step IDs found');
    }

    // Validate step dependencies and resources
    for (const step of this.steps) {
      // Check resource exists
      if (!resourceIds.has(step.action.resource)) {
        throw new Error(`Resource ${step.action.resource} not found for step ${step.id}`);
      }

      // Check dependencies exist
      for (const depId of step.dependencies) {
        if (!stepIds.has(depId)) {
          throw new Error(`Dependency ${depId} not found for step ${step.id}`);
        }
      }
    }

    // Check for circular dependencies
    this.checkCircularDependencies();
  }

  private checkCircularDependencies(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (stepId: string): boolean => {
      visited.add(stepId);
      recursionStack.add(stepId);

      const step = this.steps.find(s => s.id === stepId);
      if (step) {
        for (const depId of step.dependencies) {
          if (!visited.has(depId)) {
            if (dfs(depId)) return true;
          } else if (recursionStack.has(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(stepId);
      return false;
    };

    for (const step of this.steps) {
      if (!visited.has(step.id)) {
        if (dfs(step.id)) {
          throw new Error('Circular dependency detected in flow');
        }
      }
    }
  }

  public toJSON(): object {
    return {
      id: this.id,
      intent: this.intent,
      metadata: this.metadata,
      resources: this.resources,
      steps: this.steps
    };
  }

  public static fromJSON(data: any): DeepFlow {
    if (!data.id || !data.intent) {
      throw new Error('Invalid DeepFlow data');
    }

    return new DeepFlow(
      data.id,
      data.intent,
      data.metadata || {},
      data.resources || [],
      data.steps || []
    );
  }
} 