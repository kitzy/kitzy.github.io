---
layout: post
title: "Keep your Mac fleet updated automatically with FleetImporter"
description: "FleetImporter's new automatic update policies make it easier to keep your Mac fleet running the latest software versions without manual intervention."
date: 2026-01-29
tags: [fleet, autopkg, mac admin, automation]
---

I've added automatic update policies to FleetImporter, making it easier to keep your Mac fleet running the latest software versions. When you enable this feature, FleetImporter creates Fleet policies that detect outdated applications and automatically install updates.


## Why this matters

Before automatic updates, you had to manually create policies to check software versions and trigger installations. Now FleetImporter handles this for you during your AutoPkg runs. Each time you process a new software version, FleetImporter creates or updates a policy that finds devices running older versions and installs the update automatically.

This works with both direct mode and GitOps mode workflows, so you can use it regardless of how you manage Fleet.


## Before you enable automatic updates

Fleet doesn't detect whether an application is running before installing updates. When a policy triggers an installation, the package installer runs immediately, regardless of whether users have the app open.

This means you should be thoughtful about which apps get automatic updates enabled. Apps that users keep open all day - like Slack, Chrome, Zoom, or Microsoft Teams - can disrupt work if they update and force a restart while users are in the middle of tasks.

Consider these approaches:

Use automatic updates for background utilities and system tools that rarely impact active work. Things like security agents, monitoring tools, or productivity utilities that users don't interact with constantly are good candidates.

Skip automatic updates for always-on communication and collaboration apps. Instead, use Fleet's self-service feature to let users install updates when convenient.

Test automatic updates on a canary team first. See how your users respond before rolling out automatic updates broadly across your fleet.


## How to enable automatic updates

Automatic updates are disabled by default. Enable them by creating a recipe override and setting `automatic_update: true`.

```bash
# Create an override for your recipe
autopkg make-override VendorName/SoftwareName.fleet.recipe.yaml

# Edit the override to add automatic_update: true
# Then run the recipe
autopkg run SoftwareName.fleet.recipe.yaml
```

That's it. The next time you run the recipe, FleetImporter creates a policy for that software.


## How it works

When you enable automatic updates, FleetImporter does three things:

First, it builds a version detection query. For most macOS apps, this happens automatically by extracting the bundle identifier from the package. For edge cases, you can write a custom query using the `%VERSION%` placeholder.

Second, it creates a Fleet policy using that query. The policy checks for devices running any version except the latest one you just processed.

Third, it links the policy to the software package. When a device fails the policy check, Fleet automatically installs the update.


## Example: GitHub Desktop

Let's say you run the GitHub Desktop recipe with automatic updates enabled. FleetImporter creates a policy named `autopkg-auto-update-github-desktop` that uses this query:

```sql
SELECT 1 WHERE NOT EXISTS (
  SELECT 1 FROM apps 
  WHERE bundle_identifier = 'com.github.GitHubClient' 
  AND bundle_short_version != '3.4.3'
);
```

Any device running a version other than 3.4.3 fails this policy and automatically gets the update installed. When you process version 3.4.4 next month, FleetImporter updates the same policy with the new version number.


## Custom queries for advanced cases

The automatic bundle ID extraction works for standard macOS applications. For other scenarios, you can define a custom query:

```yaml
Input:
  automatic_update: true
  auto_update_policy_query: |
    SELECT 1 WHERE NOT EXISTS (
      SELECT 1 FROM registry 
      WHERE path = 'HKEY_LOCAL_MACHINE\Software\MyApp\Version' 
      AND data != '%VERSION%'
    );
```

This lets you handle Windows registry checks, Linux package managers, or any custom osquery logic you need.


## Things to know

Policy names use the template `autopkg-auto-update-%NAME%` where %NAME% is your software title converted to lowercase with hyphens. You can customize this template with the `AUTO_UPDATE_POLICY_NAME` variable.

Policies aren't automatically deleted when you remove software from your recipes. You'll need to clean up outdated policies manually or build automation for it.

The feature uses exact version matching with the `!=` operator. A policy passes when no apps exist with incorrect versions, which means the app isn't installed or all instances have the correct version. A policy fails when any app instance has a mismatched version.

FleetImporter escapes all bundle identifiers and versions to prevent SQL injection, so you don't need to worry about special characters in version strings.


## Try it out

If you use AutoPkg and Fleet, add automatic updates to your recipe overrides and let FleetImporter handle the policy creation. Start with low-impact utilities and expand from there based on what works for your team.

[Check out the FleetImporter documentation](https://github.com/autopkg/fleet-recipes) for complete details on automatic updates and all the other features available in FleetImporter recipes.
