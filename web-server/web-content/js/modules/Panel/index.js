import { CompilationError, LexycalError, SyntaticError } from "../../errors.js";
import getLineOf from "./Support/getLineOf.js";
import project from '../../Project.js';

let button = {};
let uploadHandlers = [];
const {
	editor,
	terminal,
	interpreter,
} = project;

const bindInputFile = (inputFile) => {
	inputFile.on('change', function() {
		const { files } = this;
		if (!files?.length) {
			return;
		}
		const [file] = files;
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			uploadHandlers.forEach((handler) => handler(text));
		};
		reader.readAsText(file);
		inputFile.val('');
	});
};

const createInputFile = () => {
	$('#control-panel').append(`<div style="display:none">
		<input type="file" id="upload" accept=".c"/>
	</div>`);
	const inputFile = $('#upload');
	bindInputFile(inputFile);
	return inputFile;
};

const reportCompilationError = (source, error) => {
	terminal.writeln('Compilation failed');
	const { index } = error;
	if (index === source.length) {
		terminal.writeln('Unexpected end of file');
		return;
	}
	if (error instanceof SyntaticError) {
		terminal.writeln(`Syntax error: ${error.message}`);
	} else if (error instanceof LexycalError) {
		terminal.writeln(`Unrecognized token`);
	} else {
		terminal.writeln(`Error: ${error.message}`);
	}
	const { line, lineCount, pos } = getLineOf(source, index);
	terminal.writeln(`${lineCount.toString().padStart(4, ' ')} | ${line}`);
	terminal.writeln(`${' '.repeat(4)} |${' '.repeat(pos)}^`);
};

const start = () => {
	terminal.clear();
	const source = editor.getText();
	try {
		const compiled = interpreter.compile(source);
		terminal.writeln('Compiled successfully');
	} catch (error) {
		if (error instanceof CompilationError) {
			reportCompilationError(source, error);
		} else {
			console.error(error);
		}
	}
};

export const init = () => {
	const buttons = $('#control-panel .panel-button');
	buttons.each(function() {
		const item = $(this);
		let name = item.attr('title')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[^\x00-\x7f]/g, '');
		button[name] = item;
	});
	const inputFile = createInputFile();
	button.upload.on('click', () => {
		inputFile.trigger('click');
	});
	button.iniciar.on('click', start);
};

export const onupload = (handler) => {
	uploadHandlers.push(handler);
};

let callNext = null;

export const next = () => {
	callNext?.();
};

export const user = () => {
	return new Promise((done) => {
		callNext = done;
	});
};
