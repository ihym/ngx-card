const ghpages = require('gh-pages');
const path = require('path');
const root = require('app-root-path').path;
const pkg = require(`${root}/package.json`);

ghpages.clean();
ghpages.publish(path.join(__dirname, '../demo/dist'), {
  message: 'chore(release): v' + pkg.version,
}, function (err) {
  if (err) {
    console.log('Error while publishing demo.', err);
    throw err;
  }
  console.log('Demo published!');
});
