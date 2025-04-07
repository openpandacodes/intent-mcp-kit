import { FlowViewerWidget } from '../../src/widgets/flow-viewer';
import { WidgetOptions } from '../../src/core/types';

interface MockDeepFlow {
  id: string;
  nodes: any[];
  edges: any[];
  metadata: Record<string, any>;
}

describe('FlowViewerWidget', () => {
  let flowViewer: FlowViewerWidget;
  let mockContainer: HTMLElement;
  const mockFlow: MockDeepFlow = {
    id: 'test-flow',
    nodes: [],
    edges: [],
    metadata: {}
  };

  beforeEach(() => {
    mockContainer = document.createElement('div');
    flowViewer = new FlowViewerWidget(mockContainer, mockFlow as any);
  });

  describe('initialization', () => {
    it('should create a flow viewer with default options', () => {
      expect(flowViewer).toBeDefined();
      expect(mockContainer.querySelector('.mcp-flow-viewer')).toBeTruthy();
    });

    it('should apply custom options', () => {
      const customOptions: WidgetOptions = {
        height: '800px',
        width: '100%',
        theme: 'dark',
        zoom: {
          min: 0.5,
          max: 2,
          step: 0.1
        }
      };
      const customViewer = new FlowViewerWidget(mockContainer, mockFlow as any, customOptions);
      expect(customViewer).toBeDefined();
    });
  });

  describe('UI elements', () => {
    it('should have toolbar controls', () => {
      expect(mockContainer.querySelector('.mcp-flow-toolbar')).toBeTruthy();
      expect(mockContainer.querySelector('button')).toBeTruthy();
    });

    it('should have SVG container', () => {
      expect(mockContainer.querySelector('svg')).toBeTruthy();
    });

    it('should have tooltip element', () => {
      expect(mockContainer.querySelector('.mcp-flow-tooltip')).toBeTruthy();
    });
  });

  describe('theme support', () => {
    it('should apply light theme by default', () => {
      expect(mockContainer.querySelector('.mcp-flow-viewer')?.classList.contains('light')).toBeTruthy();
    });

    it('should apply dark theme when specified', () => {
      const darkViewer = new FlowViewerWidget(mockContainer, mockFlow as any, { theme: 'dark' });
      expect(mockContainer.querySelector('.mcp-flow-viewer')?.classList.contains('dark')).toBeTruthy();
    });
  });
}); 