require 'net/http'
require 'json'
require 'uri'

module Jekyll
  class GitHubLanguagesGenerator < Generator
    safe true
    priority :high

    def generate(site)
      puts "🔍 GitHubLanguagesGenerator: Starting language data generation..."
      
      # Get GitHub token from environment variable
      token = ENV['PERSONAL_GITHUB_TOKEN']
      username = site.config['github_username'] || 'kitzy'
      
      if token.nil? || token.empty?
        puts "⚠️  No PERSONAL_GITHUB_TOKEN found, using fallback data"
        generate_fallback_data(site)
        return
      end

      begin
        puts "🔑 Using GitHub token for authenticated API access"
        
        # Fetch all repositories (public + private)
        repos = fetch_all_repositories(username, token)
        puts "📊 Found #{repos.length} total repositories"
        
        # Calculate language statistics
        languages = calculate_language_stats(repos)
        puts "🔤 Calculated stats for #{languages.length} languages"
        
        # Generate the data file
        site.data['github_languages'] = {
          'languages' => languages,
          'total_repos' => repos.length,
          'updated_at' => Time.now.iso8601,
          'source' => 'build_time_authenticated'
        }
        
        puts "✅ GitHub language data generated successfully"
        
      rescue => e
        puts "❌ Error generating GitHub language data: #{e.message}"
        puts "📋 Falling back to default data"
        generate_fallback_data(site)
      end
    end

    private

    def fetch_all_repositories(username, token)
      repos = []
      page = 1
      per_page = 100

      loop do
        uri = URI("https://api.github.com/user/repos?page=#{page}&per_page=#{per_page}&type=all&sort=updated")
        
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        
        request = Net::HTTP::Get.new(uri)
        request['Authorization'] = "token #{token}"
        request['Accept'] = 'application/vnd.github.v3+json'
        request['User-Agent'] = 'Jekyll-GitHub-Languages-Plugin'
        
        response = http.request(request)
        
        if response.code.to_i != 200
          raise "GitHub API error: #{response.code} - #{response.body}"
        end
        
        page_repos = JSON.parse(response.body)
        break if page_repos.empty?
        
        repos.concat(page_repos)
        page += 1
        
        # GitHub API rate limiting - be nice
        sleep(0.1)
      end

      puts "📦 Fetched #{repos.length} repositories from GitHub API"
      repos
    end

    def calculate_language_stats(repos)
      language_stats = {}
      
      repos.each do |repo|
        language = repo['language']
        next unless language
        
        # Weight calculation: stars + forks + 1 (base weight)
        weight = (repo['stargazers_count'] || 0) + (repo['forks_count'] || 0) + 1
        
        language_stats[language] = (language_stats[language] || 0) + weight
        
        puts "  📝 #{repo['name']}: #{language} (weight: #{weight})"
      end
      
      # Sort by weight and return top languages
      sorted_languages = language_stats.sort_by { |lang, weight| -weight }
      
      # Return top 8 languages with their weights
      sorted_languages.first(8).map do |lang, weight|
        {
          'name' => lang,
          'weight' => weight,
          'percentage' => calculate_percentage(weight, language_stats.values.sum)
        }
      end
    end

    def calculate_percentage(weight, total_weight)
      return 0 if total_weight == 0
      ((weight.to_f / total_weight) * 100).round(1)
    end

    def generate_fallback_data(site)
      # Fallback language data when token is not available
      site.data['github_languages'] = {
        'languages' => [
          { 'name' => 'Shell', 'weight' => 50, 'percentage' => 25.0 },
          { 'name' => 'Python', 'weight' => 40, 'percentage' => 20.0 },
          { 'name' => 'HCL', 'weight' => 30, 'percentage' => 15.0 },
          { 'name' => 'Go', 'weight' => 25, 'percentage' => 12.5 },
          { 'name' => 'JavaScript', 'weight' => 20, 'percentage' => 10.0 },
          { 'name' => 'HTML', 'weight' => 15, 'percentage' => 7.5 },
          { 'name' => 'CSS', 'weight' => 10, 'percentage' => 5.0 },
          { 'name' => 'YAML', 'weight' => 10, 'percentage' => 5.0 }
        ],
        'total_repos' => 0,
        'updated_at' => Time.now.iso8601,
        'source' => 'fallback_data'
      }
    end
  end
end