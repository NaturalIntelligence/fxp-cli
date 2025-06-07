import { XMLBuilder } from 'fast-xml-parser';
import { extname, getMessage } from './utils.js';

export function validate(inputs, outputs, options) {
  for (const input of inputs) {
    if (input !== '-' && extname(input) !== '.json') {
      throw new Error(getMessage('input_not_json', [input]));
    }
  }
  for (const output of outputs) {
    if (!output.includes('*') && extname(output) !== '.xml') {
      throw new Error(getMessage('output_not_xml', [output]));
    }
  }
  if (outputs.length && inputs.some(input => input.includes('*')) && outputs.some(output => !output.includes('*'))) {
    throw new Error(getMessage('output_wildcard_required'));
  }
}

export function process (data, options){
  const builderOptions = {
    ...options.config,
    allowBooleanAttributes: options.b ?? options.config?.allowBooleanAttributes,
    format: options.p ?? options.config?.format,
    indentBy: options.p ?? options.config?.format ? (options.config?.indentBy || '  ') : undefined,
    suppressEmptyNode: options.e ?? options.config?.suppressEmptyNode,
    preserveOrder: options.order ?? options.config?.preserveOrder,
    stopNodes: options.s ? options.s.split(',') : options.config?.stopNodes || [],
    arrayNodeName: options.config?.arrayNodeName || undefined
  };
  console.debug(builderOptions);
  const builder = new XMLBuilder(builderOptions);
  return builder.build(JSON.parse(data));
}