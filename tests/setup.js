import vm from 'vm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const window = { location: { reload: () => {} } };
const sandbox = {
  window,
  Array,
  Object,
  Map,
  Math,
  String,
  Number,
  global: globalThis,
};
const context = vm.createContext(sandbox);

const toolboxPath = path.join(projectRoot, 'src', 'js', 'toolbox.js');
const toolboxCode = fs.readFileSync(toolboxPath, 'utf8');
vm.runInContext(toolboxCode, context);

const dictionariesPath = path.join(projectRoot, 'src', 'js', 'dictionaries.js');
const dictionariesCode = fs.readFileSync(dictionariesPath, 'utf8');
vm.runInContext(dictionariesCode, context);

global.rng = sandbox.rng;
global.rngRange = sandbox.rngRange;
global.randomizer = sandbox.randomizer;
global.onlyUnique = sandbox.onlyUnique;
Array.prototype.sortByArray = sandbox.Array.prototype.sortByArray;
String.prototype.capitalizeStr = sandbox.String.prototype.capitalizeStr;
global.dictionary = sandbox.dictionary;
