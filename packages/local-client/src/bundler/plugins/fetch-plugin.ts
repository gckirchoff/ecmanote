import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we already fetched the file and it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, '') // This will replace all new lines inside the css file to collapse all the css onto one single line.
          .replace(/"/g, '\\"') // Escapes all double quotes
          .replace(/'/g, "\\'"); // EScapes all single quotes

        const contents = `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname, // describes where we found the original file
        };
        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      //   Plain js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname, // describes where we found the original file
        };
        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
