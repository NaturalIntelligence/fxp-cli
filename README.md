# FXP CLI

A command-line tool for validating XML files and converting between XML and JSON using [Fast XML Parser](https://github.com/NaturalIntelligence/fast-xml-parser).

## Features

- **Commands**: Validate XML (`val`), convert XML to JSON (`x2j`), JSON to XML (`j2x`).
- **Multiple Inputs**: Process multiple files (e.g., `fxp x2j -f input1.xml input2.xml`).
- **Localization**: Error messages in 8 languages: English (`en`), Hindi (`hi`), Spanish (`es`), French (`fr`), Japanese (`ja`), Chinese (`zh`), Tamil (`ta`), Arabic (`ar`). No change in error messages from [Fast XML Parser](https://github.com/NaturalIntelligence/fast-xml-parser).
- **Options**: Boolean attributes (`-b`), pretty printing (`-p`), stop nodes (`-s`), and more.
- **Custom Config**: Use `--config` or `--lang-file` for custom settings and languages.

## Installation
   
```bash
npm install
```

## Usage

Run commands with `node index.js` or `fxp` (if linked).

### Validate XML

```bash
fxp val -f test/input1.xml --lang en
```

Output: `test/input1.xml: Valid`

### XML to JSON

```bash
fxp x2j -f test/input1.xml test/input2.xml -o test/output1.json test/output2.json -p --lang hi
```

Creates: `test/output1.json`, `test/output2.json`

### JSON to XML

```bash
fxp j2x -f test/input1.json -o test/output.xml -p -e --lang ar
```

### Options

- `-f <file...>`: Input file(s) or `-` for stdin.
- `-o <file...>`: Output file(s).
- `-b`: Allow boolean attributes.
- `-p`: Pretty print (x2j: JSON, j2x: XML).
- `-v`: Parse values (x2j).
- `-e`: Suppress empty nodes (j2x).
- `-s <tags>`: Stop parsing at tags (comma-separated).
- `--order`: Tag ordering.
- `--config <path>`: Config file.
- `--lang <code>`: Language (e.g., `en`, `hi`, `es`, `fr`, `ja`, `zh`, `ta`, `ar`).
- `--lang-file <path>`: Custom language file.

## License

MIT