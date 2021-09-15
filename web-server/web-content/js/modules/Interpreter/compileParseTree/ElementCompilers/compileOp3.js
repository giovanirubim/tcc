import { CompilationError } from '../../../../errors.js';
import TreeCompiler from '../TreeCompiler.js';

new TreeCompiler({
	nonTerminal: 'op3',
	compile: ({ content }, context) => {
		const { operand, operations } = content;
		const data = TreeCompiler.compile(operand, context);
		if (data.valueType !== 'int') {
			const [{ operator }] = operations;
			throw new CompilationError(
				`Invalid operands for ${operator.content} at ${operand.startsAt}`,
				operand.startsAt,
			);
		}
		for (let { operator, operand } of operations) {
			const data = TreeCompiler.compile(operand, context);
			if (data.valueType === 'int') {
				continue;
			}
			throw new CompilationError(
				`Invalid operands for ${operator.content} at ${operand.startsAt}`,
				operand.startsAt,
			);
		}
		return { valueType: 'int' };
	},
});
