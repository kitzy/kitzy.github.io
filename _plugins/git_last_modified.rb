require "open3"
require "pathname"
require "time"

# Stamps each post/page document with git-derived dates so templates can
# show an "Updated on" line that links to the file's commit history.
#
# doc.data['repo_path']       - path relative to the repo root, for building
#                                a GitHub commit-history URL
# doc.data['last_modified_at'] - Time of the most recent commit touching the file
# doc.data['show_updated_on']  - true only when the file has been modified
#                                 (by calendar date) after it was originally posted
module Jekyll
  class GitLastModifiedGenerator < Generator
    safe true
    priority :low

    # "pages" as configured in _config.yml has no _pages directory backing it,
    # so content/pages/*.md files load as plain Jekyll::Page objects (site.pages)
    # rather than collection documents - handle both shapes.
    PAGES_PATH_PREFIX = "content/pages/"

    def generate(site)
      collection = site.collections["posts"]
      if collection
        collection.docs.each { |doc| stamp(doc, doc_repo_path(doc, site.source), site.source) }
      end

      site.pages.each do |page|
        next unless page.path.start_with?(PAGES_PATH_PREFIX)

        stamp(page, page.path, site.source)
      end
    end

    private

    def doc_repo_path(doc, repo_root)
      Pathname.new(doc.path).relative_path_from(Pathname.new(repo_root)).to_s
    end

    def stamp(doc, repo_path, repo_root)
      history = commit_dates(repo_root, repo_path)
      return if history.empty?

      last_modified_at = history.first
      original_date = doc.data["date"] || history.last

      doc.data["repo_path"] = repo_path
      doc.data["last_modified_at"] = last_modified_at
      doc.data["show_updated_on"] = last_modified_at.to_date > original_date.to_date
    end

    # Newest commit first, oldest last - matches `git log` default order.
    def commit_dates(repo_root, repo_path)
      out, status = Open3.capture2("git", "-C", repo_root, "log", "--format=%cI", "--", repo_path)
      return [] unless status.success?

      out.split("\n").map { |line| Time.iso8601(line) }
    rescue StandardError
      []
    end
  end
end
