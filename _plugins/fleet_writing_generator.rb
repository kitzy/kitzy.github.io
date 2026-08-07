require 'net/http'
require 'uri'
require 'json'
require 'fileutils'

# Pulls in every guide/article on fleetdm.com authored by kitzy at build time
# (via the GitHub code search API against the fleetdm/fleet repo) and exposes
# it to Liquid as `site.data.fleet_writing`. No manual list to maintain.
module Jekyll
  class FleetWritingGenerator < Generator
    safe false
    priority :high

    REPO = 'fleetdm/fleet'
    GITHUB_USERNAME = 'kitzy'
    CACHE_TTL = 3600 # seconds; keeps `jekyll serve` from re-fetching on every rebuild
    REQUEST_TIMEOUT = 8
    MAX_ATTEMPTS = 4

    def generate(site)
      cache_path = File.join(site.source, '.jekyll-cache', 'fleet-writing.json')
      fallback_path = File.join(site.source, '_data', 'fleet_writing_fallback.json')
      articles = cached_articles(cache_path)

      if articles.nil?
        begin
          articles = fetch_articles
          write_cache(cache_path, articles)
        rescue => e
          Jekyll.logger.warn 'FleetWriting:', "fetch failed (#{e.class}: #{e.message}), falling back to cache"
          articles = read_json(cache_path) || read_json(fallback_path) || []
        end
      end

      site.data['fleet_writing'] = articles
    end

    private

    def cached_articles(cache_path)
      return nil unless File.exist?(cache_path)
      return nil if Time.now - File.mtime(cache_path) > CACHE_TTL
      read_json(cache_path)
    end

    def read_json(path)
      return nil unless File.exist?(path)
      JSON.parse(File.read(path))
    rescue => e
      Jekyll.logger.warn 'FleetWriting:', "reading #{path} failed (#{e.message})"
      nil
    end

    def write_cache(cache_path, articles)
      FileUtils.mkdir_p(File.dirname(cache_path))
      File.write(cache_path, JSON.generate(articles))
    rescue => e
      Jekyll.logger.warn 'FleetWriting:', "cache write failed (#{e.message})"
    end

    def fetch_articles
      paths = search_article_paths
      articles = paths.filter_map { |path| fetch_article(path) }
      articles.sort_by { |a| a['published_on'] }.reverse
    end

    def search_article_paths
      query = %("authorGitHubUsername" value="#{GITHUB_USERNAME}" repo:#{REPO})
      url = "https://api.github.com/search/code?q=#{URI.encode_www_form_component(query)}&per_page=100"
      body = http_get(url, github_api_headers)
      data = JSON.parse(body)
      data.fetch('items', []).map { |item| item['path'] }.select do |path|
        path.start_with?('articles/') && path.end_with?('.md')
      end
    end

    def fetch_article(path)
      raw_url = "https://raw.githubusercontent.com/#{REPO}/main/#{path}"
      content = http_get(raw_url, { 'User-Agent' => user_agent })

      author = meta_value(content, 'authorGitHubUsername')
      return nil unless author == GITHUB_USERNAME

      title = meta_value(content, 'articleTitle')
      published_on = meta_value(content, 'publishedOn')
      return nil unless title && published_on

      category = meta_value(content, 'category') || 'articles'
      slug = File.basename(path, '.md')

      {
        'title' => title,
        'url' => "https://fleetdm.com/#{category}/#{slug}",
        'category' => category,
        'published_on' => published_on,
        'description' => meta_value(content, 'description'),
      }
    rescue => e
      Jekyll.logger.warn 'FleetWriting:', "skipping #{path} (#{e.message})"
      nil
    end

    def meta_value(content, name)
      content[/<meta name="#{name}" value="([^"]*)">/, 1]
    end

    def github_api_headers
      headers = {
        'Accept' => 'application/vnd.github+json',
        'User-Agent' => user_agent,
      }
      token = ENV['GITHUB_TOKEN']
      headers['Authorization'] = "Bearer #{token}" if token && !token.empty?
      headers
    end

    def user_agent
      'kitzy.com-jekyll-build'
    end

    def http_get(url, headers)
      uri = URI.parse(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.open_timeout = REQUEST_TIMEOUT
      http.read_timeout = REQUEST_TIMEOUT

      request = Net::HTTP::Get.new(uri.request_uri)
      headers.each { |key, value| request[key] = value }

      attempt = 0
      begin
        attempt += 1
        response = http.request(request)

        if response.is_a?(Net::HTTPSuccess)
          response.body
        elsif retryable?(response) && attempt < MAX_ATTEMPTS
          sleep(retry_delay(response, attempt))
          retry
        else
          raise "HTTP #{response.code} for #{url}"
        end
      rescue Timeout::Error, SocketError, Errno::ECONNRESET => e
        if attempt < MAX_ATTEMPTS
          sleep(retry_delay(nil, attempt))
          retry
        else
          raise e
        end
      end
    end

    def retryable?(response)
      %w[403 429 500 502 503 504].include?(response.code)
    end

    def retry_delay(response, attempt)
      retry_after = response && response['Retry-After']
      return retry_after.to_f if retry_after

      2**attempt # 2, 4, 8, 16 seconds
    end
  end
end
