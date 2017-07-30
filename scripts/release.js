const q = require('q');
const inquirer = require('inquirer');
const replace = require('replace');
const semver = require('semver');
const root = require('app-root-path').path;
const git = require('simple-git')( root );
const child_process = require('child_process');

const packageFile = `${root}/package.json`;
const changelogFile = `${root}/CHANGELOG.md`;

function requestReleaseType(current) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What type of release would you like?',
      choices: ['patch', 'minor', 'major'].map(type => `${type} (${semver.inc( current, type )})`),
      default: 0
    }
  ]).then(function( answers ) {
      return answers.type.match(/\(.*\)/g)[0].slice(1, -1);
  });
}

function bump( version ) {

  replace({
    regex: /"version": "[^"]+"/m,
    replacement: `"version": "${version}"`,
    paths: [ packageFile ],
    recursive: false,
  });

  return q.when( version );
}

function preVersion( version ) {
  return inquirer.prompt([
    { type: 'confirm', name: 'continue', message: `Continue with release of ${version}? (Last chance to edit CHANGELOG!)`, default: true },
  ]).then(function( answer ) {
    if (answer.continue) {
      return version;
    } else {
      console.log('Resetting hard...');
      git.reset('hard');
      return q.reject();
    }
  });
}

function runVersion( version ) {
  if (!version) {
    console.log('No valid version!');
    process.exit(1);
  }

  var deferred = q.defer();

  console.log('Committing...');
  git.commit(`chore(release): ${version}`, [ packageFile, changelogFile ], () => {
    console.log('Tagging...');
    git.addAnnotatedTag(`v${version}`, 'Version release', () => deferred.resolve(version));
  });

  return deferred.promise;
}

function publish(version) {
  var deferred = q.defer();
  console.log('Publishing...');
  child_process.exec('gulp prepublish && npm publish ./node_modules/ngx-card', function (err, stdout, stderr){
    if (err) {
      console.log('child processes failed with error code: ', err);
      deferred.reject();
    } else {
      console.log(stdout);
      deferred.resolve(version);
    }
  });
  return deferred.promise;
}

function push() {
  return inquirer.prompt({
    type: 'confirm',
    name: 'push',
    message: 'Push to origin?',
    default: true,
  }).then(function(response) {
    if (response.push) {
      git.push('origin', 'master', () => git.pushTags('origin'));
    }
  });
}

function changelog( version ) {
  const shell = require('shelljs');

  var deferred = q.defer();
  shell.exec(`${root}/node_modules/.bin/conventional-changelog -p angular -i ${changelogFile} -s`, (code) => {
    deferred.resolve(version);
  });
  return deferred.promise;
}

// Start
const currentVersion = require(packageFile).version;

requestReleaseType(currentVersion)
.then(bump)
.then(changelog)
.then(preVersion)
.then(runVersion, () => q.reject())
.then(publish, () => q.reject())
.then(push);
