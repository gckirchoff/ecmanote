import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;

      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;

      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);
        return state;

      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;

      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;

        // With immer
        state.data[id].content = content;
        return state;

      // without immer
      // return {
      //   ...state,
      //   data: {
      //     ...state.data,
      //     [id]: {
      //       ...state.data[id],
      //       content,
      //     },
      //   },
      // };

      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;

      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: generateRandomId(),
        };

        state.data[cell.id] = cell;

        const currentCellIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        if (currentCellIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(currentCellIndex + 1, 0, cell.id);
        }
        return state;

      default:
        return state;
    }
  }
);

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 9); // toString(36) provides numbers and letters.
};

export default reducer;
