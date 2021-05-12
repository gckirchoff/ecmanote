import path from 'path';
import { Command } from 'commander';
import { serve } from '@ecmanote/local-api';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'Port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file. The file will be stored at ${dir}.`
      );
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.error(
          'Port is in use. Try running on another port. You can manually use another port with the -p argument.'
        );
      } else {
        console.log(`Here's the problem: ${err.message}`);
      }
      process.exit(1);
    }
  });
