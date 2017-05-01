module Jekyll
  module ReadingData
    class ImagesGenerator < Jekyll::Generator

      class << self
        def images_hash
          @images_hash ||= {}
        end
      end

      def generate(site)

        @paths_for_deletion = self.class.images_hash.clone
        @path = nil
        @destination = site.config['merge_images']['dest']

        def modified?(md5_hash)
          self.class.images_hash[@path] != md5_hash
        end

        def copy_file(path_to_file)
          dest_path = "#{@destination}/#{path_to_file.split('/').drop(1).drop(1).join('/')}"
          FileUtils.mkdir_p(File.dirname(dest_path))
          FileUtils.cp(path_to_file, dest_path)
        end

        def write(path_to_file)
          md5_hash = Digest::MD5.hexdigest File.read @path
          file_exist = File.exist?(path_to_file)

          if file_exist
              @paths_for_deletion.delete(path_to_file)
          end

          return false if file_exist && !modified?(md5_hash)

          self.class.images_hash[@path] = md5_hash
          copy_file(path_to_file)
          true
        end

        def delete_file(path_to_file)
          path_to_delete = "#{@destination}/#{path_to_file.split('/').drop(1).drop(1).join('/')}"
          if File.exist?(path_to_delete)
            FileUtils.rm(path_to_delete)
            self.class.images_hash.delete(path_to_file)
          end
        end

        sources = site.config['merge_images']['sources']
        sources.each { |src|
          files_in_dir = Dir["#{src}/**/*"].select {|f| !File.directory?(f) }
          files_in_dir.each { |path_to_file|
            @path = path_to_file
            write(path_to_file)
          }
        }

        @paths_for_deletion.each { |key, value|
          delete_file(key)
        }

      end
    end
  end
end