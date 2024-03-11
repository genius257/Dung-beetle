#!/usr/bin/env node

import parser, { IncludeStatement } from "autoit3-pegjs";
import * as fs from 'fs';
import Parser from "./ast/Parser";
import { Command, program } from 'commander';

program
    .description('')
    .argument('<file>')
    .option('-m, --minify', 'minifies the script')
    .option('-o, --out <file>', 'output file path')
    .action((file: string, options: {minify: boolean, out: string|null}) => {

        file = fs.realpathSync(file);

        let script = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });

        console.log(script);

        const ast = parser.parse(script);

        // Traverse the tree and replace include statements with included scripts recursively

        // Apply the minification, if the flag is present
        script = options.minify ? Parser.AstToString(ast) : script;

        //output to file
        fs.writeFileSync(
            options.out ? fs.realpathSync(options.out) : (file + '.min.a3x'),
            script,
            {
                flag: 'w',
            }
        );
    });

program.parse(process.argv);
