import { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import CellListItem from '../../components/CellListItem/CellListItem';
import AddCell from '../../components/AddCell/AddCell';
import './CellList.scss';
import { useActions } from '../../hooks/useActions';

const CellList: React.FC = () => {
  const cellDataArr = useTypedSelector(({ cells: { order, data } }) => {
    // I want state.cells.order and state.cells.data
    return order.map((id) => {
      return data[id];
    });
  });

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cellDataArr.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list-container">
      <AddCell forceVisible={cellDataArr.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
