module Jekyll
  $WpHashes = YAML::load_file 'wp-data/cache.yml'

  class Resizer
    def write_hash
      File.open('wp-data/cache.yml', 'w') { |f| f.write $WpHashes.to_yaml }
    end

    def resize_blog_img
      sizes = [350, 450, 700]
      images = Dir['wp-data/img/blog-post/*/post*c.jpg']

      images.map do |image|
        name = (image.split('/')[4]).split('.')[0]
        folder = (image.split('/')[3])
        md5_hash = Digest::MD5.hexdigest File.read image

        if $WpHashes[image] != md5_hash
          sizes.map do |size|

            output = "wp-data/img/blog-post/#{folder}/#{name}-#{size}.jpg"
            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} #{output}"
            system(cmd)

          end
          $WpHashes[image] = md5_hash
          write_hash
        end
      end
    end

    def resize_portfolio_img
      sizes = [350, 450, 700]
      images = Dir['wp-data/img/*/work_portfolio_cover_p.jpg']

      images.map do |image|
        name = (image.split('/')[3]).split('.')[0]
        folder = (image.split('/')[2]).split('.')[0]
        md5_hash = Digest::MD5.hexdigest File.read image

        if $WpHashes[image] != md5_hash

          sizes.map do |size|
            output = "wp-data/img/#{folder}/#{name}-#{size}.jpg"
            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} #{output}"
            pid = spawn(cmd)
            Process.wait(pid)
          end

          $WpHashes[image] = md5_hash
          write_hash
        end
      end
    end
  end

  class ImgResizeGenerator < Generator
    safe true

    def generate(site)

      if ENV['MODE'] == "STAGING"
        resizer = Resizer.new

        resizer.resize_portfolio_img
        resizer.resize_blog_img
      end

    end
  end
end

