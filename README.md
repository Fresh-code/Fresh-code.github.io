# [Fresh-code site](https://freshcodeit.com)
Site is created by [Jekyll] - simple, blog-aware static site generator.
## Installation
Install: 
- ruby 
- imagemagick

Required ruby-gems:
- bundler
After installation run `bundle install`

For css/js minification **install by juicer (`juicer install [name]`):**
- yui_compressor
- jslint

## Usage
**_config.yml**  - jekyll config file

**jekyll build** - command that generate site in _site folder

**jekyll serve** - command that run jekyll in watch mode (localhost:4000)

*For optimisation build/re-build process we store information about changing all pic/js/css file in _assets-cache/cache.yml.
 All plugins store in _plugins folder. Some of them can store default setting in config files _config.yml, CssMinify.yml, JsMinify.yml*

[Jekyll]: <https://jekyllrb.com>