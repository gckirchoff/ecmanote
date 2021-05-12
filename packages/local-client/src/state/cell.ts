export type CellTypes = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
}
