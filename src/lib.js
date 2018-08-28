const yargs = require('yargs');
const colors = require('colors/safe');
const prompt = require('prompt');
const shell = require('shelljs');
const info = require('../package');

const schema = [{
  name: 'dir',
  description: 'Project directory',
  default: 'new-project',
  type: 'string',
  pattern: /(\w+\.?)*-?\w+/g,
  message: 'Project directory must be alphanumeric'
}];

const confirmSchema = [{
  name: 'confirm',
  description: 'All is fine?',
  type: 'string',
  required: true,
  default: 'yes',
  pattern: /(yes|y|no|n)/i
}];

class GulpUpCli {
  constructor() {
    this.prompt = prompt;
    this.schema = schema;
    this.confirmSchema = confirmSchema;
    this.prompt.override = yargs.argv;
    this.prompt.message = colors.rainbow(info.name);
    console.log(colors.rainbow(info.name) + `: v${info.version}`)
  }

  requestData() {
    /* Interact */
    this.prompt.get(this.schema, (err, options) => {
      if (options) {
        /* clear overrides for second run */
        this.prompt.override = null;

        console.log('Check this and confirm: ');
        Object.keys(options).forEach(k => {
          const option = this.schema.find(i => i.name === k);
          console.log(`${option.description}: ${options[k]}`);
        });

        /* Confirm */
        this.prompt.get(this.confirmSchema, (err, result) => {
          if (result && ['yes', 'y'].includes(String(result.confirm).toLowerCase())) {
            this.clone(options);
          } else {
            this.run();
          }
        })
      } else {
        console.log('\r\n'); //add empty line for non 0 exit
      }
    });
  }

  run() {
    this.prompt.start();
    this.requestData();
  }

  clone(options = '') {
    /* todo: use NodeJS implementation */
    shell.exec(`git clone https://github.com/iliyat/gulp-up ${options.dir}`);
  }
}

module.exports = GulpUpCli;