import { useActions } from '../../hooks/useActions';
import ActionBarButton from '../ActionBarButton/ActionBarButton';
import './ActionBar.scss';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();
  return (
    <div className="action-bar">
      <ActionBarButton
        handleClick={() => moveCell(id, 'up')}
        icon="fa-arrow-up"
      />
      <ActionBarButton
        handleClick={() => moveCell(id, 'down')}
        icon="fa-arrow-down"
      />
      <ActionBarButton handleClick={() => deleteCell(id)} icon="fa-times" />
    </div>
  );
};

export default ActionBar;
