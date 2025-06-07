import { XMLValidator } from 'fast-xml-parser';
import { extname, getMessage } from './utils.js';

export function validate(inputs, outputs, options) {
  for (const input of inputs) {
    if (input !== '-' && extname(input) !== '.xml') {
      throw new Error(getMessage('input_not_xml', [input]));
    }
  }
  if (outputs.length && inputs.some(input => input.includes('*')) && outputs.some(output => !output.includes('*'))) {
    throw new Error(getMessage('output_wildcard_required'));
  }
}
export function process(data, options){
  const parserOptions = {
    ...options.config,
    allowBooleanAttributes: options.b ?? options.config?.allowBooleanAttributes
  };
  const result = XMLValidator.validate(data, parserOptions);
  return result === true ? 'Valid' : `Error: ${result.err.msg}`;
}