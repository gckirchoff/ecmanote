To install:
`npm install ecmanote -g`

To use, create a folder, CD into that folder, then write `ecmanote serve`.
This will create a default file in that directory.
One can choose what file is created (and subsequently accessed at a later time) in the directory by adding an optional parameter `ecmanote serve example.js` to either create example.js or access example.js if it has already been created in that directory.
The port can also be defined by writing `p=5000` or `port=5000`. Default port is 4005.

Example usage:
`mkdir ds&a-notes`
`cd ds&a-notes`
`ecmanote serve hashtables.js`
