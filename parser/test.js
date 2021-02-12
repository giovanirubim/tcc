import * as fs from 'fs'
import * as syntax from './syntax.js'

const src = fs.readFileSync('./sample.c')
	.toString('utf8')
	.replace(/\r/g, '')

console.log(JSON.stringify(syntax.parse(src), null, '|  '))
