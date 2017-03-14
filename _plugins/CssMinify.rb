
module Jekyll
  $minified_filename = ''
  $flags = Array.new

  # use this as a workaround for getting cleaned up
  # reference: https://gist.github.com/920651
  class CssMinifyFile < StaticFile
    def write(dest)
      # do nothing
    end
  end

  # minify css files
  class CssMinifyGenerator < Generator
    safe true

    def write_hash
      File.open('_assets-cache/cache.yml', 'w') { |f| f.write $Hashes.to_yaml }
    end

    def generate(site)
      config = Jekyll::CssMinifyGenerator.get_config

      files_to_minify = config['files'] || get_css_files(site, config['css_source'])

      files_to_minify.map do | filepath |
        md5_hash = Digest::MD5.hexdigest File.read filepath

        flag = $Hashes[filepath] != md5_hash
        $flags << flag

        if flag
          $Hashes[filepath] = md5_hash
        end
      end

      $flags.map do |flag|
        @flag = flag ? true : false
        break if @flag
      end

      last_modified = files_to_minify.reduce( Time.at(0) ) do |latest,filepath|
        modified = File.mtime(filepath)
        modified > latest ? modified : latest
      end
      # reset the minified filename
      $minified_filename = last_modified.strftime("%Y%m%d%H%M") + '.min.css'

      output_dir = File.join(site.config['destination'], config['css_destination'])
      output_file = File.join(output_dir, $minified_filename)

      # need to create destination dir if it doesn't exist
      FileUtils.mkdir_p(output_dir)
      minify_css(files_to_minify, output_file, @flag)
      site.static_files << CssMinifyFile.new(site, site.source, config['css_destination'], $minified_filename)
      # minify_css(files_to_minify, output_file)
      # site.static_files << CssMinifyFile.new(site, site.source, config['css_destination'], $minified_filename)
    end

    # read the css dir for the css files to compile
    def get_css_files(site, relative_dir)
      # not sure if we need to do this, but keep track of the current dir
      pwd = Dir.pwd
      Dir.chdir(File.join(site.config['source'], relative_dir))
      # read css files
      css_files = Dir.glob('*.css').map{ |f| File.join(relative_dir, f) }
      Dir.chdir(pwd)

      return css_files
    end

    def minify_css(css_files, output_file, flag)
      if flag
        css_files = css_files.join(' ')
        juice_cmd = "juicer merge -f #{css_files} -o #{output_file}"
        # puts juice_cmd
        system(juice_cmd)

        write_hash
      end
    end

    # Load configuration from CssMinify.yml
    def self.get_config
      if @config == nil
        @config = {
            'css_source' => 'css', # relative to the route
            'css_destination' => '/css' # relative to site.config['destination']
        }
        config = YAML.load_file('CssMinify.yml') rescue nil
        if config.is_a?(Hash)
          @config = @config.merge(config)
        end
      end

      return @config
    end
  end

  class CssMinifyLinkTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      config = Jekyll::CssMinifyGenerator.get_config
      File.join(config['css_destination'], $minified_filename)
    end
  end
end

Liquid::Template.register_tag('minified_css_file', Jekyll::CssMinifyLinkTag)