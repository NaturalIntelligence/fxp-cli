import { readFile, writeFile, globby, extname, basename, loadConfig, loadMessages, getMessage } from './utils.js';
import * as j2x from "./j2x.js";
import * as validator from "./validator.js";
import * as x2j from "./x2j.js";

// Handler interface: { validate, process }
const handlers = {
  val: validator,
  x2j: x2j,
  j2x:j2x
};

// Process input (single or batch)
export async function processInput(command, options) {
  const handler = handlers[command];
  if (!handler) {
    throw new Error(getMessage('unknown_command', [command]));
  }

  const { file: inputs, output: outputs = [], config: configPath, lang, langFile, ...commandOptions } = options;
  await loadMessages(lang, langFile);
  const config = await loadConfig(configPath, command);
  const mergedOptions = { ...commandOptions, config, lang, langFile };
  
  // if (input.includes('*') && output && !output.includes('*')) {
  //   throw new Error(getMessage('output_wildcard_required'));
  // }

  if (inputs.length === 1 && !inputs[0].includes('*')) {
    await processSingle(command, inputs[0], outputs[0], mergedOptions);
  } else {
    await processBatch(command, inputs, outputs, mergedOptions);
  }
}

// Process single file or stdin
async function processSingle(command, input, output, options) {
  const handler = handlers[command];
  let data;

  try {
    handler.validate([input], output ? [output] : [], options);
    data = input === '-' ? await readFile('-') : await readFile(input);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  try {
    const result = handler.process(data, options);
    if (output) {
      await writeFile(output, result);
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error(`Error: ${getMessage(command === 'j2x' ? 'invalid_json' : 'invalid_xml', [error.message])}`);
    process.exit(1);
  }
}

// Process batch files
async function processBatch(command, inputs, outputs, options) {
  const handler = handlers[command];
  let files = [];

  try {
    // Check if any input contain wildcards
    const hasWildcards = inputs.some(input => input.includes('*'));
    if (hasWildcards) {
      // Use globby for wildcard patterns
      for (const pattern of inputs) {
        const matchedFiles = await globby(pattern);
        if (!matchedFiles.length) {
          throw new Error(getMessage('no_files_matched', [pattern]));
        }
        files.push(...matchedFiles);
      }
    } else {
      // Use explicit file list
      files = inputs;
    }

    handler.validate(files, outputs, options);
    
     if (command !== 'val' && outputs.length && files.length !== outputs.length) {
      throw new Error(getMessage('input_output_count_mismatch', [outputs.length, files.length]));
    }

    for (let i = 0; i < files.length; i++) {
      const input = files[i];
      const output = outputs[i] || null;
      try {
        const data = await readFile(input);
        const result = handler.process(data, options);
        if (command === 'val') {
          console.log(`${input}: ${result}`);
        } else if (output) {
          await writeFile(output, result);
        }
      } catch (error) {
        console.error(`Error: ${getMessage('failed_processing_file', [input, error.message])}`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}