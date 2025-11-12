---
layout: post
title: "Why vendor-managed app catalogs aren't the answer"
description: "Vendor app catalogs are useful, but they're not the complete answer. Why IT teams still need control over software deployment timing and custom packages."
date: 2025-11-12
tags: [autopkg, device management, software deployment]
---

If you've been watching the device management space lately, you've noticed something: every vendor is racing to build the biggest app catalog. It's become a feature war, with companies competing on who can offer more automatically-updating applications. "Deploy Chrome with one click!" "Keep Slack updated automatically!" "Thousands of apps, always current!"

It sounds great. And for some organizations, it is great. Vendor-managed catalogs are a useful tool. But here's what the marketing doesn't tell you: they're not the complete solution. Automatically deploying the latest version of every app isn't the right move for everyone. In fact, for many IT teams, it's exactly the wrong move.

Vendor-managed catalogs are _an_ answer to software deployment challenges. They're just not _the_ answer.


## When "always latest" breaks things

Let's start with the obvious: change control policies. If you work in healthcare, finance, or any regulated industry, you can't just push software updates whenever vendors release them. You need approval processes. You need documentation. You need to demonstrate that you've evaluated the change and understood its impact.

I've watched IT teams scramble because an auto-updated app broke a critical workflow. Maybe it was a Chrome update that changed how a web application rendered. Maybe it was an Adobe update that introduced a bug in a template everyone uses. The specific failure doesn't matter as much as the principle: when you give up control over when updates happen, you're gambling that every release will be stable and compatible with your environment.

Most vendors release software that works great most of the time. But most of the time isn't good enough when you're managing thousands of devices that people rely on to do their jobs.


## Testing isn't optional

Here's a use case that should resonate with anyone who's been in IT for more than a few years: you need to test updates before deploying them widely.

This means running the new version in a test environment. Checking if it works with your VPN client. Verifying it doesn't conflict with your security tools. Making sure it still integrates with that internal web app that's held together with duct tape and prayers.

You can't do this testing if the update has already been pushed to everyone's laptop. You need a staging process. You need the ability to hold back versions while you validate them. You need package automation tools pulling down new releases so you can test them in a controlled environment before they reach production.

Some organizations need even more granular control. They want to roll out updates to 5% of devices first, then 25%, then 50%, before hitting everyone. You can't do canary deployments if you don't control the timing of updates.


## Regulatory requirements aren't suggestions

Let's talk about compliance. Some industries have requirements that make automatic updates complicated or impossible.

Medical device software often requires validation testing before any update. Financial services companies need to document changes for audit purposes. Government contractors may have specific approval processes for any software change.

These aren't theoretical concerns. They're regulatory requirements with real consequences. An IT team that can't demonstrate control over their software deployment process isn't just making a technical choice—they're creating compliance risk.

And it's not just highly regulated industries. Any organization with a robust quality assurance process needs control over when changes happen. If you're running a design studio and Adobe releases a new version of Creative Cloud, you don't want it auto-installing the day before a major client presentation. You want to schedule that update for a maintenance window after the project ships.


## The catalog will never be complete

Here's the reality that every device management vendor knows but doesn't always say clearly: no catalog will ever have 100% of the apps that 100% of customers need.

I learned this lesson repeatedly in my previous role heading up client platform engineering at Fastly. I'd evaluate new device management vendors, and the pitch was always the same: "We have over 300 apps in our software catalog, and we add new ones every week!"

That's great. Genuinely. But here's what would stop every evaluation dead in its tracks: "Can I deploy custom packages?"

Sometimes the answer was no. Sometimes it was "that's on the roadmap." Either way, it was a dealbreaker. Because those 300 apps, impressive as they were, would never include the half dozen internally developed apps I needed to distribute.

It's impossible for any vendor to catalog every app. There are too many apps. Too many niche tools. Too many internal applications that were built specifically for one organization.

I've worked with companies that use proprietary software from tiny vendors. I've seen organizations with internal tools built by developers who left five years ago. I've watched teams manage specialized scientific software that serves an audience of maybe 200 people worldwide.

None of these apps will ever be in a vendor's catalog. But they still need to be deployed and managed.

This is where custom packages become essential. And if you're managing custom packages, you need a way to create, test, and deploy them. You need a workflow that handles both the apps in your vendor's catalog and the ones that aren't.

That's where package automation tools come in. Tools like AutoPkg have been the standard in the Mac admin world for over a decade because they solve a real problem: you need a reliable, repeatable way to package software that isn't in anyone's catalog.


## The real solution: choice

The best device management vendors understand this. They're not trying to force everyone into an "always latest" model. They're giving customers choice.

Here's what that looks like in practice: you deploy Google Chrome from your vendor's catalog and configure it to auto-update. You trust Google's release process and you want security patches deployed immediately. Great.

But you also deploy Adobe Creative Cloud. For this one, you pull releases through your own packaging workflow, test them in your staging environment, get approval from your creative team, and then deploy them on your schedule. Maybe that's a one-week lag behind the official release. Maybe it's a month. It depends on your needs.

Same device management platform. Two different approaches. Both apps deployed and managed effectively.

This flexibility matters because different organizations have different needs. A startup with 20 employees has different requirements than a hospital with 5,000 devices. A design agency operates differently than a financial services firm. One-size-fits-all solutions fail when the problem space is this diverse.


## Why this matters now

I spent 15 years helping organizations adopt Apple devices in enterprise environments. I've seen technology trends come and go. I've watched vendors make big promises about how their new feature will solve all your problems.

What I've learned is this: the best tools give you control without forcing complexity on you. They make the simple things easy and the complex things possible.

App catalogs are great for the simple things. They make it easy to deploy common applications without building your own packaging workflow. If all you need is Chrome, Slack, and Zoom, you're covered.

But enterprise IT is rarely simple. You've got legacy applications, regulatory requirements, change control processes, and specialized tools that don't exist anywhere else. You need the ability to manage both the standard apps and the edge cases.

That's why vendor-managed catalogs can't be the only option. As long as organizations need control over their software deployment process—and they will always need that control—there will be a need for platforms that support both approaches.


## The path forward

If you're evaluating device management platforms, ask about custom package support. Ask about deployment workflows. Ask if you can choose, on an app-by-app basis, whether to use automatic updates or controlled deployment.

The right vendor won't force you into a single model. They'll give you options. They'll make the easy things easy and support you when you need more control.

And they'll understand that while their app catalog might cover 80% or even 95% of what most customers need, that last 5% is often the most critical. Those are the apps that make your organization unique. Those are the tools your team depends on.

Package automation tools have been solving this problem for years. They're still solving it today. And they'll keep solving it for years to come, because the fundamental problem—the need for controlled, reliable, repeatable software deployment—isn't going away.

The app catalog arms race will continue. Vendors will keep adding more apps and better automation. That's good. We should welcome improvements.

But we should also recognize that automation isn't the same as control. And sometimes, control is exactly what you need.