export type ToolType = 'pencil' | 'eraser' | 'bucket' | 'rect' | 'ellipse';

export interface Tool {
  type: ToolType;
  size: number;
  color: string;
}

export const DEFAULT_TOOL: Tool = {
  type: 'pencil',
  size: 4,
  color: '#ff0000'
};
