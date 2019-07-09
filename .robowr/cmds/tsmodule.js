"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Fill these with your own defaults, if you want...
exports.init = {
    "name": '',
    "author" : '' 
};

// Ask one of the options ?
/*

{
  "?name" : ""
}

*/

// Example dependencies...
/*
https://blog.cloudboost.io/initializing-a-react-app-using-typescript-and-webpack-4320b6ed38c2

yarn add react react-dom
yarn add bootstrap@4.0.0-beta reactstrap@next
yarn add --dev typescript typings tslint
yarn add --dev @types/react @types/react-dom @types/reactstrap
yarn add --dev webpack  webpack-dev-server  html-webpack-plugin extract-text-webpack-plugin  raw-loader  css-loader  style-loader sass-loader  node-sass  url-loader  file-loader  awesome-typescript-loader
*/

// How to create tests...
/*
https://journal.artfuldev.com/write-tests-for-typescript-projects-with-mocha-and-chai-in-typescript-86e053bdb2b6
*/

exports.short_doc = 'Initialize Project';
function run(wr) {
    const model = wr.getState();
    // creating the application basic structure...
    wr.getFileWriter('/src/', 'index.ts').raw(`
// the starting point of the applictaion ${model.name}

export function HelloWorld() {
  return 'Hello World!'
}
  
  `);

  // Do not add models and views this time
  /*
    wr.getFileWriter('/src/model/', 'index.ts').raw(`
// The ${model.name} models come about here
  
  `);
    wr.getFileWriter('/src/views/', 'index.ts').raw(`
// Views of ${model.name}
  
  `);
  */
    
  const readme = wr.getFileWriter('/', 'README.md').raw(`
# Project ${model.name}

The project readme.

`);

    wr.getFileWriter('/dist/', 'index.js').raw(`
// empty stub
`);


wr.getFileWriter('/test/', 'test_base.ts').raw(`

import { HelloWorld } from '../src/index'
import { expect } from 'chai';

describe('Hello function', () => {
  it('should return hello world', () => {
    expect(HelloWorld()).to.equal('Hello World!');
  });
});

`);

  
    // create the typescript configuration file...
    wr.getFileWriter('/', 'tsconfig.json').raw(`{
    "compilerOptions": {
      "target": "es5",
      "moduleResolution": "node",
      "module": "commonjs",
      "rootDir": ".",
      "outDir": "dist",
      "allowSyntheticDefaultImports" : true,
      "sourceMap": true,
      "inlineSources": true,    
      "declaration": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "removeComments": false,
      "noImplicitAny": false,
      "jsx": "react",
      "lib": ["es6", "es2015","dom"]
    },
    "include": [
        "./**/*",
    ],  
    "exclude": [
      "dist/**/*",
      "node_modules",
      ".npm",
      "docs",
    ]  
  }  
  `, true);
    // 
    const gitIgnore = wr.getFileWriter('/', '.gitignore');
    gitIgnore.raw(`
# Dependency directories
node_modules/

# folder files
data_folder/

# Image files
*.jpg
*.png

# MacOS
.DS_Store
.idea/

# TypeScript compiled .map files
*.map  
  `);
    // write the package json file
    
    const p = wr.getFileWriter('/', 'package.json');
    // set the state for the writer based on the params...
    p.setState({
      'package.json' : {
        "name": model.name,
        "version": "1.0.0",
        "description": model.name,
        "main": "index.js",
        "scripts": {
          "test": "find ./dist/ -name \"*.d.ts\" -delete && tsc && ./node_modules/.bin/mocha dist/test/ --recursive --reporter spec"
        },
        "keywords": [
        ],
        "author": model.author,
        "license": "MIT",
        "dependencies": {
          "typescript": "^3.0.1",
          "@types/chai": "^4.1.4",
          "@types/mocha": "^5.2.5",
          "@types/node": "^10.5.6"
        },
        "devDependencies": {
          "chai": "^4.1.2",
          "mocha": "^5.2.0"
        }
      }
    })

    // Then at the and, write it
    p.fn( p => {
      const model = p.getState()
      const data = model['package.json']
      p.raw( JSON.stringify( data, null, 2 ))
    })
    
}
exports.run = run;
//# sourceMappingURL=doremifa.js.map