source "https://rubygems.org"

# Jekyll
gem "jekyll", "~> 4.3"

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-github-metadata"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
end

# Development tools
group :development do
  gem "bundler-audit", require: false
end

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance optimization for watching directories on Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]