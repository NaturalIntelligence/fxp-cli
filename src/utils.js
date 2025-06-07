import { readFile as fsReadFile, writeFile as fsWriteFile } from 'fs/promises';
import { globby as fsGlobby } from 'globby';
import { extname as pathExtname, basename as pathBasename } from 'path';

// Valid fast-xml-parser options for validation
const validOptions = {
  val: ['allowBooleanAttributes', 'unpairedTags'],
  x2j: [
    'allowBooleanAttributes', 'unpairedTags', 'ignoreAttributes', 'ignoreDeclaration',
    'ignoreDoctype', 'ignorePiTags', 'attributeNamePrefix', 'attributesGroupName',
    'stopNodes', 'preserveOrder', 'parseTagValue', 'parseAttributeValue',
    'processEntities', 'removeNSPrefix'
  ],
  j2x: [
    'allowBooleanAttributes', 'format', 'indentBy', 'suppressEmptyNode',
    'arrayNodeName', 'removeNSPrefix', 'stopNodes', 'preserveOrder'
  ]
};

// Load and validate configuration
export async function loadConfig(path, command) {
  if (!path) {
    return {};
  }
  try {
    const config = JSON.parse(await fsReadFile(path, 'utf8'));
    validateConfig(command, config);
    return config;
  } catch (error) {
    throw new Error(getMessage('config_load_error', [error.message]));
  }
}

// Validate configuration against supported options
export function validateConfig(command, config) {
  const validKeys = validOptions[command] || [];
  const invalidKeys = Object.keys(config).filter(key => !validKeys.includes(key));
  if (invalidKeys.length) {
    throw new Error(`Invalid config options for ${command}: ${invalidKeys.join(', ')}`);
  }
}

// File I/O utilities
export async function readFile(path) {
  if (path === '-') {
    return new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => (data += chunk));
      process.stdin.on('end', () => resolve(data));
    });
  }
  try {
    return await fsReadFile(path, 'utf8');
  } catch (error) {
    // console.error(`File read error details:`);
    // console.error(`- Path: ${path}`);
    // console.error(`- Error code: ${error.code}`);
    // console.error(`- Error message: ${error.message}`);

    throw new Error(getMessage('file_read_error', [path]));
  }
}

export async function writeFile(path, data) {
  await fsWriteFile(path, data, 'utf8');
}

export async function globby(pattern) {
  return fsGlobby(pattern);
}

export function extname(path) {
  return pathExtname(path);
}

export function basename(path, ext) {
  return pathBasename(path, ext);
}



let messages = null;
export async function loadMessages(lang = 'en', langFile = null) {
  if (messages && messages.lang === lang && messages.langFile === langFile) {
    return messages.data;
  }
  try {
    let data;
    if (langFile) {
      data = JSON.parse(await fsReadFile(langFile, 'utf8'));
    } else {
      data = JSON.parse(await fsReadFile(new URL(`../lang/${lang}.json`, import.meta.url), 'utf8'));
    }
    messages = { lang, langFile, data };
    return data;
  } catch (error) {
    if (lang !== 'en' || langFile) {
      console.error(getMessage('lang_load_error', [langFile || lang, error.message]));
      return loadMessages('en'); // Fallback to English
    }
    throw new Error(getMessage('lang_load_error', [lang, error.message]));
  }
}

export function getMessage(key, params = []) {
  if (!messages || !messages.data[key]) {
    return `${key}: ${params.join(', ')}`; // Fallback if message not found
  }
  return messages.data[key].replace(/{(\d+)}/g, (_, index) => params[index] || '');
}