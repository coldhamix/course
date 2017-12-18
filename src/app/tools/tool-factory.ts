import { Ellipse } from './ellipse';
import { Rectangle } from './rectangle';
import { Pencil } from './pencil';
import { Bucket } from './bucket';
import { Tool } from '../model/tool';
import { Eraser } from './eraser';

export function toolFactory(canvas: HTMLCanvasElement, tool: Tool) {
  switch (tool.type) {
    case 'bucket':
      return new Bucket(canvas, tool);
    case 'pencil':
      return new Pencil(canvas, tool);
    case 'eraser':
      return new Eraser(canvas, tool);
    case 'rect':
      return new Rectangle(canvas, tool);
    case 'ellipse':
      return new Ellipse(canvas, tool);
  }
}
