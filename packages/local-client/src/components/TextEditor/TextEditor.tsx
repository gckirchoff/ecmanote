import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './TextEditor.scss';
import { Cell } from '../../state';
import { useActions } from '../../hooks/useActions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [writingMD, setWritingMD] = useState(false);
  // const [value, setValue] = useState('# Header');
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        console.log('element clicked on is inside editor');
        return;
      }
      console.log('element clicked is nNOT inside editor');

      setWritingMD(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (writingMD) {
    return (
      <div className="markdown-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(text) => updateCell(cell.id, text || '')}
        />{' '}
        {/** text could be undefined, but value state is said to only be a string. */}
      </div>
    );
  }

  return (
    <div className="markdown-editor card" onClick={() => setWritingMD(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
