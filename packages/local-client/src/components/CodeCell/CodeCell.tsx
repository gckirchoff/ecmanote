import { useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useCumulativeCode } from '../../hooks/useCumulativeCode';
import CodeEditor from '../CodeEditor/CodeEditor';
import Preview from '../Preview/Preview';
import Resizable from '../Resizable/Resizable';
import './CodeCell.scss';
import { Cell } from '../../state';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // const [code, setCode] = useState('');
  // const [bundleErrStatus, setBundleErrStatus] = useState('');
  // const [input, setInput] = useState('');
  const { updateCell, createBundle } = useActions(); // destructured from actionCreators from state's index file.
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);
    // If the user pauses for 1 second, then bundle the code. If they keep updating input, timer will keep getting
    // canceled and reset until they pause for 1 second.

    // If one returns a function, it will be called automatically the next time useEffect is called.
    // This will cancel the previous timer.
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div className="cell-container">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-cover-container">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundleErrStatus={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
