import ParseTreeNode from '../ParseTreeNode.js';
import parseGlobalLine from './parseGlobalLine.js';

export default (tokenGenerator) => {
    const lines = [];
    while (tokenGenerator.next()) {
    	lines.push(parseGlobalLine(tokenGenerator));
    }
	return new ParseTreeNode({
		typeName: 'program',
        content: lines,
		children: [ ...lines ],
	});
};
