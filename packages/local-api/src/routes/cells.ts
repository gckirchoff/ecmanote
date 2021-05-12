import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'markdown' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf8' });

      // Parse a list of cells out of the file
      // Send the list of cells back to the browser
      res.send(JSON.parse(result));
    } catch (err) {
      // If read throws an error, we can inspect the error and see if the file doesn't exist
      if (err.code === 'ENOENT') {
        // Add code to create a file and add default cells
        const introCellsContent = [
          {
            content:
              '# Hello and welcome to Ecmanote!\n\nThis is an interactive, local coding environment that allows you to write, compile, and execute your javascript all in real time!\n\nNotes may also be written using markdown text cells.\n\nAll changes are automatically saved to the file name and location of your choice.\n\nshow() is a built in function, similar to console.log() that allows you to show any React component, string, number, etc. in the preview window to the right of the coding area.\n\nAny variables defined in a cell will be accessible in any prior cell.\n\nYou may import packages such as axios as seen below.',
            type: 'markdown',
            id: '57us2cfsfn9f',
          },
          {
            content: `import { useState } from 'react';

          const Counter = () => {
            const [count, setCount] = useState(0);
            return (
              <div>
                <button onClick={() => setCount(count + 1)}>Click</button>
                <h3>{count}</h3>
              </div>
            );
          };
          
          // Display any variable or react Component by calling 'show()'
          show(<Counter />);`,
            type: 'code',
            id: 'fa2afliuy4mf',
          },
          {
            content: `const App = () => {
                return (
                  <div>
                    <p>
                      As you can see, we have access to the previously defined{' '}
                      <code>Counter</code> component here as well.
                    </p>
                    <hr />
                    <Counter />
                  </div>
                );
              };
              
              show(<App />);`,
            type: 'code',
            id: '09182KLHJFe89f',
          },
          {
            content: `import axios from 'axios';
            import 'bulma/css/bulma.css'
            
            axios
              .get('http://jsonplaceholder.typicode.com/users/1')
              .then(({ data }) => show(data.name));`,
            type: 'code',
            id: '57uslkfjess2c9f',
          },
        ];
        await fs.writeFile(fullPath, `${introCellsContent}`, 'utf-8');
        res.status(200).send(introCellsContent);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request object
    // and serialize the cells
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.status(201).json({
      status: 'success',
    });
  });

  return router;
};
