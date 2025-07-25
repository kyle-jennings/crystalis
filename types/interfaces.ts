// Global TypeScript interfaces for the Crystalis game project

declare global {
  // Level Editor interfaces
  interface ToolArg {
    name: string;
    type: string;
    default?: any;
    required: boolean;
    options?: string[];
  }

  interface Tool {
    name: string;
    color: string;
    args: ToolArg[];
  }

  interface Window {
    game: {
      levelEditor?: {
        setSelectedTool: (key: string) => void;
        exportLevel: () => void;
        toggleDeleteMode: () => boolean;
      };
    };
    CrystalisGame?: {
      devMode: {
        currentTab: number;
        toggleLevelEditor: () => void;
      };
    };
  }
}

export {};
