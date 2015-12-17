var autoprefixer     = require('metalsmith-autoprefixer')
var browserSync      = require('metalsmith-browser-sync')
var postcss          = require('metalsmith-postcss')
var calc             = require('postcss-calc')
var customMedia      = require('postcss-custom-media')
var customProperties = require("postcss-custom-properties")
var atImport         = require("postcss-import")
var cssnano          = require('cssnano')
var fingerprint      = require('metalsmith-fingerprint-ignore')
var inPlace          = require('metalsmith-in-place')
var metalsmith       = require('metalsmith')
var layout           = require('metalsmith-layouts')
var collections      = require('metalsmith-collections')
var permalinks       = require('metalsmith-permalinks')
var pagination       = require('metalsmith-pagination')
var feed             = require('metalsmith-feed')
var sitemap          = require('metalsmith-sitemap')
var pageTitles       = require('metalsmith-page-titles')
var linkcheck        = require('metalsmith-linkcheck')
var If               = require('metalsmith-if')
var compress         = require('metalsmith-gzip')
var formatcheck      = require('metalsmith-formatcheck')
var htmlMinifier     = require("metalsmith-html-minifier")
var each             = require('metalsmith-each')

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

  // Process css
  .use(autoprefixer(supported))
  .use(postcss(plugins))
  .use(fingerprint({ pattern: 'index.css' }))

  .use(each((file, filename) => {
    if(!!filename.match(/^H941000/g)) {
      var player
      if(file.platform == 'youtube')
        player = `<iframe width="420" height="315" src="https://www.youtube.com/embed/${file.video_id}" allowfullscreen></iframe>`
      else if(file.platform == 'vimeo')
        player = `<iframe width="420" height="315" src="https://player.vimeo.com/video/${file.video_id}" allowfullscreen></iframe>`
      else
        throw new Error(platform + ' is unsupported')

      file.contents = new Buffer(`<h3>
                                  <a href="/H941000/${file.channel_title}/${file.title}"
                                     title="${file.channel} - ${file.name}">${file.date}</a>
                                  </h3>
                                  ${player}`)
      file.contents_without_layout = file.contents
    }
  }))

  .use(collections({
    "H941000": {
      pattern: 'H941000/**/**.html',
      sortBy: 'timestamp',
      reverse: true
    }
  }))

  .use(permalinks({
      relative: false,
      pattern: ':collections/:channel/:title'
  }))

  .use(pagination({
    'collections.H941000': {
      perPage: 5,
      layout: 'H941000.jade',
      first: 'index.html',
      path: 'page/:num/index.html',
      pageMetadata: {
        title: 'H941000'
      }
    }
  }))

  .use(layout({
    engine: 'jade',
    'default': 'default.jade',
    'pattern': '**/**.html'
  }))

  // .use(formatcheck({ verbose: true }))

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

  .use(sitemap({ hostname: 'http://321157.eu' }))

  .use(If(
    !process.env.PRODUCTION,
    // Serve and watch for changes
    browserSync({
      server : '.tmp',
      files : ['src/**/*', 'layouts/**/*']
    })
  ))

  .use(If(
    process.env.PRODUCTION,
    htmlMinifier()
  ))

  .use(If(
    process.env.PRODUCTION,
    postcss([cssnano])
  ))

  .use(If(
    process.env.PRODUCTION,
    compress()
  ))

  // Build site
  .build(function(err){
    if (err) throw err
  })
