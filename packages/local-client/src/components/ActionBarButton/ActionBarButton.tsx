interface ActionBarButtonProps {
  handleClick(): any;
  icon: string;
}

const ActionBarButton: React.FC<ActionBarButtonProps> = ({
  handleClick,
  icon,
}) => {
  return (
    <button className="button is-primary is-small" onClick={handleClick}>
      <span className="icon">
        <i className={`fas ${icon}`}></i>
      </span>
    </button>
  );
};

export default ActionBarButton;
