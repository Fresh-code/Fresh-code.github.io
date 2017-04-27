module Jekyll

  module Reading
    class Generator < Jekyll::Generator
      def generate(site)

        def folder_worker (target, data_path)
          files_in_dir = Dir["#{data_path}/*"].select {|f| !File.directory?(f) }
          folders_in_dir = Dir.glob("#{data_path}/*").select { |f| File.directory?(f) }
          add_files_to_data(files_in_dir, target)

          folders_in_dir.each { |dir_path|
            target[dir_path.split('/').last] = {}
            folder_worker(target[dir_path.split('/').last], dir_path)
          }
        end

        def add_files_to_data (files_paths_arr, data)
          files_paths_arr.each do |filepath|
            data_name = filepath.split('/').last.split('.')[0]
            data[data_name] = read_file(filepath)
          end
        end

        def read_file(file_name)
          JSON.parse(File.read(file_name))
        end

        folder_worker(site.data, site.config['add_data_src']['data'])

      end
    end
  end
end