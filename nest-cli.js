const depositsPath = process.env.DEPOSIT_REPOSITORY_FILE_PATH;
const exchangesPath = (process.env.EXHANGE_REPOSITORY_FILE_PATH =
  './exchanges.json');
module.exports = () => ({
  collection: '@nestjs/schematics',
  sourceRoot: 'src',
  compilerOprions: {
    assets: [depositsPath, exchangesPath],
  },
});
