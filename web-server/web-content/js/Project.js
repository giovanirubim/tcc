import * as Editor from './modules/Editor';
import * as MemViewer from './modules/MemViewer';
import * as Panel from './modules/Panel';
import Terminal from './modules/Terminal';
import Interpreter from './modules/Interpreter';
import Memory from './modules/Memory';

const project = {
	editor: Editor,
	memViewer: MemViewer,
	terminal: Terminal,
	interpreter: Interpreter,
	panel: Panel,
	memory: Memory,
};

export default project;
