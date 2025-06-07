#!/usr/bin/env node

import { program } from 'commander';
import { processInput } from './src/parser.js';
import pkg from './pkg.cjs';

// CLI setup
program
  .name('fxp')
  .version(pkg.version)
  .description('Fast XML Parser CLI for validation, XML-to-JSON, and JSON-to-XML');

program
  .command('val')
  .description('Validate XML')
  .option('-f, --file <input...>', 'Input XML file(s) or - for stdin', ['-'])
  .option('-b', 'Allow boolean attributes')
  .option('--config <path>', 'Custom configuration file')
  .option('--lang <language>', 'Language for error messages (e.g., en, hi, es)', 'en')
  .option('--lang-file <path>', 'Custom language file path')
  .action(async (options) => {
    await processInput('val', options);
  });

program
  .command('x2j')
  .description('Convert XML to JSON')
  .option('-f, --file <input...>', 'Input XML file(s) or - for stdin', ['-'])
  .option('-o, --output <output...>', 'Output JSON file(s)')
  .option('-b', 'Allow boolean attributes')
  .option('-p', 'Pretty-print JSON')
  .option('-v', 'Parse values to native types')
  .option('-s <tags>', 'Stop parsing at tags (comma-separated)')
  .option('--order', 'Preserve tag order')
  .option('--config <path>', 'Custom configuration file')
  .option('--lang <language>', 'Language for error messages (e.g., en, hi, es)', 'en')
  .option('--lang-file <path>', 'Custom language file path')
  .action(async (options) => {
    await processInput('x2j', options);
  });

program
  .command('j2x')
  .description('Convert JSON to XML')
  .option('-f, --file <input...>', 'Input JSON file(s) or - for stdin', ['-'])
  .option('-o, --output <output...>', 'Output XML file(s)')
  .option('-p', 'Enable formatted output')
  .option('-e', 'Suppress empty elements')
  .option('-b', 'Allow boolean attributes')
  .option('-s <tags>', 'Stop parsing at tags (comma-separated)')
  .option('--order', 'Preserve tag order')
  .option('--config <path>', 'Custom configuration file')
  .option('--lang <language>', 'Language for error messages (e.g., en, hi, es)', 'en')
  .option('--lang-file <path>', 'Custom language file path')
  .action(async (options) => {
    await processInput('j2x', options);
  });

program.parse();