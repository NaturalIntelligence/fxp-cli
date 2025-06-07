import { XMLParser } from 'fast-xml-parser';
import { extname, getMessage } from './utils.js';

export function validate(inputs, outputs, options) {
  for (const input of inputs) {
    if (input !== '-' && extname(input) !== '.xml') {
      throw new Error(getMessage('input_not_xml', [input]));
    }
  }
  for (const output of outputs) {
    if (!output.includes('*') && extname(output) !== '.json') {
      throw new Error(getMessage('output_not_json', [output]));
    }
  }
  if (outputs.length && inputs.some(input => input.includes('*')) && outputs.some(output => !output.includes('*'))) {
    throw new Error(getMessage('output_wildcard_required'));
  }
}

export function process(data, options){
  const parserOptions = {
    ...options.config,
    allowBooleanAttributes: options.b ?? options.config?.allowBooleanAttributes,
    preserveOrder: options.order ?? options.config?.preserveOrder,
    parseTagValue: options.v ?? options.config?.parseTagValue,
    parseAttributeValue: options.v ?? options.config?.parseAttributeValue,
    stopNodes: options.s ? options.s.split(',') : options.config?.stopNodes || []
  };
  const parser = new XMLParser(parserOptions);
  const result = parser.parse(data);
  return options.p ? JSON.stringify(result, null, 2) : JSON.stringify(result);
}