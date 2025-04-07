import { Intent } from '../core/types';

export interface FlowViewerConfig {
  theme?: 'light' | 'dark';
  onNodeClick?: (intent: Intent) => void;
}

export class FlowViewer {
  private container: HTMLElement;
  private config: FlowViewerConfig;
  private intents: Intent[] = [];

  constructor(config: FlowViewerConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    const container = document.createElement('div');
    container.className = `intent-flow-viewer ${this.config.theme || 'light'}`;
    container.innerHTML = `
      <div class="flow-header">
        <h3>Intent Flow</h3>
      </div>
      <div class="flow-container" id="flow-container"></div>
    `;
    this.container = container;
  }

  public async loadIntents(): Promise<void> {
    // Implementation will fetch and display intents
  }

  public render(target: HTMLElement): void {
    target.appendChild(this.container);
  }

  public destroy(): void {
    this.container.remove();
  }
}