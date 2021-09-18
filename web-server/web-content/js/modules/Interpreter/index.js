import * as Editor from '../Editor';
import * as Terminal from '../Terminal';
import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import ParsingContext from './ParsingContext.js';
import { CompilationError } from '../errors.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    const context = new ParsingContext({ tokenGenerator });
    try {
        return context.parse('program');
    } catch(error) {
        if (error instanceof CompilationError) {
            if (error.index === source.index) {
                Terminal.writeln('Unexpected end of file');
            } else {
                Terminal.writeln('at ' + error.index);
                Terminal.writeln(error.toString());
                Terminal.writeln(`${
                    source.substr(error.index, 10)
                }`);
            }
        } else {
            console.error(error);
        }
    }
};

$(document).ready(() => {
    Editor.load();
    Terminal.init();
    $('#editor-section textarea').on('input', () => {
        Terminal.clear();
        if (run(Editor.getText())) Terminal.writeln('Success');
    });
    Terminal.clear();
    if (run(Editor.getText())) Terminal.writeln('Success');
});