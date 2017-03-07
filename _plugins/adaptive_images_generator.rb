module Jekyll

  class Resizer
    def write_hash
      File.open('_assets-cache/cache.yml', 'w') { |f| f.write $Hashes.to_yaml }
    end

=begin
    def resize_blog_img
      sizes = [350, 450, 700]
      images = Dir['img/blog-post/post*c.jpg']

      images.map do |image|
        name = (image.split('/')[2]).split('.')[0]
        md5_hash = Digest::MD5.hexdigest File.read image

        if $Hashes[image] != md5_hash
          sizes.map do |size|
            puts "img/blog-post/#{name}-#{size}.jpg"

            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/blog-post/#{name}-#{size}.jpg"
            system(cmd)
            # pid = spawn(cmd)
            # Process.wait(pid)
          end
          $Hashes[image] = md5_hash
          write_hash
        end
      end
    end

    def resize_portfolio_img
      sizes = [350, 450, 700]
      images = Dir['img/portfolio/work*p.jpg']

      images.map do |image|
        name = (image.split('/')[2]).split('.')[0]
        md5_hash = Digest::MD5.hexdigest File.read image

        if $Hashes[image] != md5_hash
          sizes.map do |size|
            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/portfolio/#{name}-#{size}.jpg"
            pid = spawn(cmd)
            Process.wait(pid)
          end
          $Hashes[image] = md5_hash
          write_hash
        end
      end
    end
  end
=end

    def resize_blog_img
      sizes = [350, 450, 700]
      images = Dir['img/blog-post/*/post*c.jpg']

      images.map do |image|
        name = (image.split('/')[3]).split('.')[0]
        folder = (image.split('/')[2])
        md5_hash = Digest::MD5.hexdigest File.read image

        if $Hashes[image] != md5_hash
          sizes.map do |size|
            #puts "img/blog-post/#{name}-#{size}.jpg"

            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/blog-post/#{folder}/#{name}-#{size}.jpg"
            system(cmd)
            # pid = spawn(cmd)
            # Process.wait(pid)
          end
          $Hashes[image] = md5_hash
          write_hash
        end
      end
    end

    def resize_portfolio_img
      sizes = [350, 450, 700]
      #images = Dir['img/portfolio/covers/work_*_p.jpg']
      images = Dir['img/*/work_portfolio_cover_p.jpg']

      images.map do |image|
        name = (image.split('/')[2]).split('.')[0]
        folder = (image.split('/')[1]).split('.')[0]
        md5_hash = Digest::MD5.hexdigest File.read image

        if $Hashes[image] != md5_hash
          sizes.map do |size|
            cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/#{folder}/#{name}-#{size}.jpg"
            pid = spawn(cmd)
            Process.wait(pid)
          end
          $Hashes[image] = md5_hash
          write_hash
        end
      end
    end
  end

  class ImgResizeGenerator < Generator
    safe true

    def generate(site)
      resizer = Resizer.new

      resizer.resize_portfolio_img
      resizer.resize_blog_img
    end
  end
end

