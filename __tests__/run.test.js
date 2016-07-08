require('babel-polyfill');

const _      = require('lodash'),
      stylus = require('stylus'),
      should = require('should'),
      fs     = require('fs'),
      colors = require('colors');


const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};

const readFile = function (path) {
  return normalizeContent(fs.readFileSync(path, 'utf-8'));
};


/**
 * Gets all the files in a folder
 * @param  {str} dir       -> the folder we wish to get all the files from
 * @param  {arr}  fileList -> cur file list
 * @param  {str} fileExt   -> particalr extention we want to find
 * @return {arr}           -> List of file names, without type type
 */
const walkFileSync = function(dir, fileList = [], fileExt = '.txt') {
  fs.readdirSync(dir).forEach(function(file) {
    //filter
    if (file.indexOf(fileExt) !== -1) {
      //puch file without ext
      fileList.push(file.replace(fileExt, ''));
    }
  });
  return fileList;
};


/**
 * Gets base level of all the folders
 * @param  {str} dir         -> dircorts to get all the fodlers in
 * @param  {arr}  folderList -> array return
 * @return {arr}             -> folder lsit
 */
const walkFolderBase = function(dir, folderList = []) {
  fs.readdirSync(dir).forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      folderList.push(file);
    }
  });
  return folderList;
};


/**
 * Get all the test directories for a particialr test group
 * @param  {str} dir      -> current directory
 * @param  {str} rootPath -> root path
 * @param  {arr}  dirList -> director list
 * @return {arr}          -> director lsit
 */
const getAllDir = function (dir, rootPath, dirList = []) {
  rootPath = rootPath || dir;
  let curList = walkFolderBase(dir);
  if (curList.length) {
    dirList = _.map(curList, function (file) {
      let curPath = dir + '/' + file;
      let isBase = getAllDir(curPath, rootPath, dirList, true);
      //check if base
      if (isBase) {
        return isBase;
      }
    });
    return _.flattenDeep(dirList);
  }
  return dir;
};


/**
 * Runs test group from dir
 * @param  {str} testDir -> dir
 * @return {---}         -> runs test
 */
const runTestGroup = function (testDir) {
  //Case level for test
  describe(testDir, function () {
    let testFiles = walkFileSync(testDir);
    _.forEach(testFiles, function (fileName) {
      //Base level for test
      describe(fileName, function () {
        //set local
        let fileLoc = testDir + '/' + fileName;
        //get files
        let styl = readFile(fileLoc + '.styl'),
            css  = readFile(fileLoc + '.css'),
            txt  = readFile(fileLoc + '.txt');

        //set stylus
        let style = stylus(styl)
                    .import('src/buttron.styl');

        //run/render test
        it(txt, function () {
          //render styles
          style.render(function (err, actual) {
            if (err) {
              throw err;
            }
            actual.trim().should.equal(css.trim());
          });
        });

      });
    });
  });
};

/**
 * The test runner
 * @param {str} dir -> root directory
 */
const addTests = function(dir) {
  let testGroups = walkFolderBase(dir);
  //cylce groups
  _.forEach(testGroups, function (group) {
    let curDir = dir + '/' + group;
    //root level for tests
    describe(group, function () {
      //get dir
      let allDir = getAllDir(curDir);
      allDir = _.isArray(allDir) ? allDir : [allDir];
      //add current dir
      allDir.push(curDir)
      //cycle test group dir
      _.forEach(allDir, function (testDir) {
        runTestGroup(testDir);
      });
    });
  });
};



addTests('__tests__/cases');
