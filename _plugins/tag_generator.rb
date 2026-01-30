module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag'
        site.tags.each_key do |tag|
          # Generate the tag index page
          site.pages << TagPage.new(site, site.source, tag)
          
          # Generate the tag RSS feed
          site.pages << TagFeedPage.new(site, site.source, tag)
        end
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir = File.join('tag', tag.downcase.gsub(' ', '-'))
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['title'] = "Posts tagged \"#{tag}\""
    end
  end

  class TagFeedPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir = File.join('tag', tag.downcase.gsub(' ', '-'))
      @name = 'feed.xml'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag-feed.xml')
      self.data['tag'] = tag
    end
  end
end
