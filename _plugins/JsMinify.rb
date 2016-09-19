module Jekyll
  $minified_js_filename = ''

  # use this as a workaround for getting cleaned up
  # reference: https://gist.github.com/920651
  class JsMinifyFile < StaticFile
    def write(dest)
      # do nothing
    end
  end

  # minify js files
  class JsMinifyGenerator < Generator
    safe true

    def generate(site)
      config = Jekyll::JsMinifyGenerator.get_config

      files_to_minify = config['files'] || get_js_files(site, config['js_source'])

      files_to_minify.map do |filepath|
        $minified_js_filename = filepath['name'] + '.min.js'

        output_dir = File.join(site.config['destination'], config['js_destination'])
        output_file = File.join(output_dir, $minified_js_filename)

        # need to create destination dir if it doesn't exist
        FileUtils.mkdir_p(output_dir)
        minify_js(filepath['path'], output_file)
        site.static_files << JsMinifyFile.new(site, site.source, config['js_destination'], $minified_js_filename)
      end
    end

    # read the js dir for the js files to compile
    def get_js_files(site, relative_dir)
      # not sure if we need to do this, but keep track of the current dir
      pwd = Dir.pwd
      Dir.chdir(File.join(site.config['source'], relative_dir))
      # read js files
      js_files = Dir.glob('*.js').map{ |f| File.join(relative_dir, f) }
      Dir.chdir(pwd)

      return js_files
    end

    def minify_js(js_files, output_file)
      # js_files = js_files.join(' ')
        juice_cmd = "juicer merge -s -f #{js_files} -o #{output_file}"
        # puts juice_cmd
        pid = spawn(juice_cmd)
        Process.wait(pid)
    end

    # Load configuration from JsMinify.yml
    def self.get_config
      if @config == nil
        @config = {
            'js_source' => 'js', # relative to the route
            'js_destination' => '/js' # relative to site.config['destination']
        }
        config = YAML.load_file('JsMinify.yml') rescue nil
        if config.is_a?(Hash)
          @config = @config.merge(config)
        end
      end

      return @config
    end
  end

  class JsMinifyLinkTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      config = Jekyll::JsMinifyGenerator.get_config
      File.join(config['js_destination'], $minified_js_filename)
    end
  end
end

Liquid::Template.register_tag('minified_js_file', Jekyll::JsMinifyLinkTag)