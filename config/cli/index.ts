/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as yargs from 'yargs';
import { preBuild } from './pre-build';
yargs
  // .command(open)
  .command(preBuild)
  // .command(uploadWeapp)
  .help()
  .alias('help', 'h')
  .alias('version', 'v').argv;