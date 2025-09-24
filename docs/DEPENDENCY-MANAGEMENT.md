# Dependency Management Guide

This guide outlines the automated and manual processes for keeping dependencies secure and up-to-date in the kitzy.github.io Jekyll site.

## 🔒 Security-First Philosophy

Our dependency management strategy prioritizes security updates with these key principles:

- **Daily security checks** via Dependabot and GitHub Actions
- **Automated vulnerability scanning** on every push and PR
- **Fail-fast approach** - builds fail if vulnerabilities are detected
- **Manual override capability** for critical security updates

## 🤖 Automated Systems

### Dependabot Configuration

Located in `.github/dependabot.yml`, this configuration provides:

**Daily Security Updates:**
- Runs at 6:00 AM PST every day
- Focuses on security patches and critical updates
- Creates PRs automatically for vulnerable dependencies

**Weekly Version Updates:**
- Runs every Monday at 9:00 AM PST  
- Updates Ruby gems and GitHub Actions
- Groups related updates to reduce PR noise

**Features:**
- Auto-groups Jekyll plugins together
- Separate tracking for Actions and Ruby dependencies
- Commit message prefixes for easy identification (`deps`, `security`, `ci`)

### GitHub Actions Security Audit

Located in `.github/workflows/security-audit.yml`, this workflow:

**Triggers:**
- Every push to main branch
- Every pull request
- Weekly on Mondays
- Manual dispatch when needed

**Security Checks:**
- Runs `bundle-audit` to check for known vulnerabilities
- Updates vulnerability database automatically
- Generates security reports as artifacts
- Comments on PRs when vulnerabilities are found
- **Fails the build** if vulnerabilities are detected

**Dependency Monitoring:**
- Lists outdated dependencies in job summaries
- Generates dependency trees for analysis
- Provides actionable reports in GitHub interface

## 🛠️ Manual Tools

### Local Dependency Script

The `scripts/update-deps.sh` script provides local dependency management:

```bash
# Basic usage - full update with security check
./scripts/update-deps.sh

# Security-only mode - check vulnerabilities without updates
./scripts/update-deps.sh --security-only

# Dry run - see what would be updated
./scripts/update-deps.sh --dry-run

# Verbose output for debugging
./scripts/update-deps.sh --verbose

# Combined options
./scripts/update-deps.sh --security-only --verbose
```

**Script Features:**
- Color-coded output for easy scanning
- Security vulnerability database updates
- Comprehensive dependency reporting
- Dry-run mode for safe previewing
- Detailed logging with timestamps
- Automatic report generation

### Bundle Audit Integration

The `bundle-audit` gem is now included in development dependencies for:
- Local security scanning
- CI/CD integration
- Vulnerability database management
- Automated security reporting

## 📋 Maintenance Procedures

### Daily Workflow

1. **Automated Checks:** Dependabot runs daily security scans
2. **PR Review:** Review any security update PRs promptly
3. **Build Monitoring:** Check that security audit actions pass

### Weekly Workflow  

1. **Version Updates:** Review Dependabot's weekly update PRs
2. **Audit Review:** Check weekly security audit results
3. **Manual Check:** Run local script if needed:
   ```bash
   ./scripts/update-deps.sh --security-only
   ```

### Emergency Security Updates

When critical vulnerabilities are discovered:

1. **Immediate Assessment:**
   ```bash
   ./scripts/update-deps.sh --security-only --verbose
   ```

2. **Update Vulnerable Dependencies:**
   ```bash
   bundle update --conservative [gem-name]
   ```

3. **Verify Fix:**
   ```bash
   bundle audit check
   ```

4. **Test Locally:**
   ```bash
   bundle exec jekyll serve
   ```

5. **Deploy via PR** (never push directly to main)

### Dependency Report Analysis

Generated reports include:
- Ruby and Bundler versions
- Complete gem inventory
- Security audit results
- Outdated dependency list
- Timestamp for tracking

## 🚨 Security Response Plan

### Vulnerability Detection

When vulnerabilities are found:

1. **Automatic Detection:** GitHub Actions will fail and create alerts
2. **PR Blocking:** Vulnerable PRs cannot be merged
3. **Notification:** Security issues appear in GitHub Security tab
4. **Reporting:** Detailed vulnerability info in action logs

### Response Steps

1. **Assess Impact:** Review vulnerability details and affected gems
2. **Update Strategy:** Determine if conservative or major update needed
3. **Test Changes:** Use local development environment
4. **Deploy Fix:** Follow normal PR workflow with expedited review
5. **Verify Resolution:** Confirm security audit passes

## 🔧 Configuration Files

### Key Files and Their Purpose

- `.github/dependabot.yml` - Automated dependency updates
- `.github/workflows/security-audit.yml` - Security scanning
- `Gemfile` - Dependency declarations with security tools
- `scripts/update-deps.sh` - Manual maintenance script

### Customization Options

**Dependabot Scheduling:**
- Modify `schedule.time` for different update times
- Adjust `open-pull-requests-limit` to control PR volume
- Update `timezone` for your location

**Security Audit Frequency:**
- Change cron schedule in workflow file
- Modify artifact retention periods
- Adjust notification settings

**Local Script Options:**
- Customize colors and output formatting
- Add additional security tools
- Modify report generation format

## 📚 Best Practices

### Security Guidelines

1. **Never ignore security warnings** - always investigate and fix
2. **Update security patches immediately** - don't wait for weekly cycles  
3. **Test thoroughly** after security updates
4. **Monitor GitHub Security advisories** for your dependencies
5. **Keep Ruby version updated** for latest security patches

### Development Guidelines

1. **Review dependency changes** in PRs before merging
2. **Test locally** after any dependency updates
3. **Use conservative updates** when possible (`bundle update --conservative`)
4. **Document security decisions** in commit messages
5. **Monitor build failures** and respond quickly

### Monitoring Guidelines

1. **Check GitHub Actions** weekly for any failures
2. **Review Dependabot PRs** promptly (especially security ones)
3. **Run manual audits** before major releases
4. **Keep vulnerability database updated** locally
5. **Monitor site performance** after updates

## 🆘 Troubleshooting

### Common Issues

**Build Failures After Updates:**
```bash
# Clear bundle cache and reinstall
rm -rf vendor/bundle
bundle install
```

**Security Audit False Positives:**
```bash
# Update vulnerability database
bundle audit update
bundle audit check
```

**Local Script Permission Issues:**
```bash
chmod +x scripts/update-deps.sh
```

**Dependabot PR Conflicts:**
- Resolve manually or close and let Dependabot recreate
- Check for Gemfile.lock conflicts

### Emergency Contacts

- **Security Issues:** Create GitHub Security Advisory
- **Build Problems:** Check GitHub Actions logs
- **Dependency Questions:** Review gem documentation

## 📈 Success Metrics

Track these metrics to measure security posture:

- **Zero-day vulnerability response time**
- **Dependency freshness** (how outdated dependencies are)
- **Security audit pass rate**
- **Time between vulnerability disclosure and fix**
- **Build failure recovery time**

## 🔄 Review Schedule

This documentation should be reviewed:
- **Monthly:** Check for new security tools and practices
- **Quarterly:** Assess effectiveness of current processes  
- **Annually:** Major review of strategy and tooling
- **After incidents:** Update procedures based on lessons learned

---

*Last updated: September 24, 2025*
*Next review: October 24, 2025*