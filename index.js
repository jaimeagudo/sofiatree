module.exports = process.env.SOFIATREE_COVERAGE
  ? require('./lib-cov/sofia-tree')
  : require('./lib/sofia-tree')