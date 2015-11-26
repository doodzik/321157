var autoprefixer     = require('metalsmith-autoprefixer')
var browserSync      = require('metalsmith-browser-sync')
var postcss          = require('metalsmith-postcss')
var calc             = require('postcss-calc')
var customMedia      = require('postcss-custom-media')
var customProperties = require("postcss-custom-properties")
var atImport         = require("postcss-import")
var fingerprint      = require('metalsmith-fingerprint')
var ignore           = require('metalsmith-ignore')
var inPlace          = require('metalsmith-in-place')
var metalsmith       = require('metalsmith')
var layout           = require('metalsmith-layouts')
var collections      = require('metalsmith-collections')
var permalinks       = require('metalsmith-permalinks')
var pagination       = require('metalsmith-pagination')
var feed             = require('metalsmith-feed')
var sitemap          = require('metalsmith-sitemap')
var linkcheck        = require('metalsmith-linkcheck')

// Import metadata
var metadata         = require('./metadata')

// Postcss plugins
var plugins = [
  customMedia,
  customProperties,
  calc,
  atImport
]

// Autoprefixer settings
var supported = { browsers: ['> 1%', 'last 2 versions', 'IE >= 9'] }

// Build
metalsmith(__dirname)
  // Build to .tmp
  .destination('.tmp')

  // Process metadata
  .metadata(metadata)

  .use(collections({
    "H941000": {
      pattern: 'H941000/**.html',
      sortBy: 'date',
      reverse: true
    }
  }))

  .use(permalinks({
      pattern: ':collections/:title'
  }))

  .use(pagination({
    'collections.H941000': {
      perPage: 5,
      layout: 'H941000.jade',
      first: 'index.html',
      path: 'page/:num/index.html'
    }
  }))

  .use(layout({ engine: 'jade' }))

  .use((files, metalsmith, done) => {
    var file, filename
    for (filename in files) {
      file = files[filename]
      if(!!file.stats)
        file.date = file.stats.mtime
    }
    done()
  })

  .use(feed({
    collection: 'H941000',
    destination: 'H941000/rss.xml'
  }))

  // Process css
  .use(autoprefixer(supported))
  .use(postcss(plugins))

  .use(sitemap({ hostname: 'http://321157.eu' }))

  // Serve and watch for changes
  .use(browserSync({
    server : '.tmp',
    files : ['src/**/*', 'templates/**/*']
  }))

  // Build site
  .build(function(err){
    if (err) throw err
  })
