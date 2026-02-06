---
layout: post
title: "Stop clicking and start committing: why endpoint management needs to catch up"
description: "Other IT disciplines figured out configuration as code years ago. It's time endpoint management joined them."
date: 2026-02-09
tags: [work, fleet, mac admin, institutional knowledge]
---

Every other discipline in IT figured this out years ago.

Infrastructure? Configuration as code. Networking? Configuration as code. Application deployment? Configuration as code. But somehow, when it comes to endpoint management, we're still clicking through web interfaces like it's 2010, manually applying changes one setting at a time, crossing our fingers that we remember what we changed when something breaks three months from now.

This isn't just inefficient. It's technical debt we've been pretending doesn't exist.

## We're behind, and we know it

The infrastructure folks moved to configuration as code because they had to. When you're managing thousands of servers, clicking through a GUI to change a setting isn't just tedious - it's impossible. The sheer scale forced them to solve the problem.

Endpoint management has the same scale problem. We're managing thousands of devices. We're making configuration changes that affect entire fleets of computers. But we're still treating our configuration management like it's a small-scale operation where we can keep track of things in our heads or in a spreadsheet somewhere.

Maybe we've gotten comfortable with clickops because the tools made it easy. Maybe we haven't felt the pain acutely enough yet. Maybe we've been told - or we've told ourselves - that our teams aren't technical enough to handle git workflows.

Whatever the reason, we're behind. And every day we stay behind, we're accumulating invisible technical debt.

## The objections I hear

I talk to client platform engineers about moving to GitOps workflows regularly. The objections are consistent:

"It's too hard."

"It's too complicated."

"Not enough people on our team know how to use git."

Let's be direct about what's happening here. These objections aren't really about git. They're about assumptions we've made about who can learn what, and about what skills we consider "fundamental" for IT professionals at different levels.

We've decided that git is an advanced skill, reserved for developers and senior engineers. We've decided that helpdesk staff and junior engineers can't or shouldn't learn it. We've decided that clicking through a web interface is more accessible than writing configuration in code.

I think we're wrong on all counts.

## Git is not that hard

Here's what you actually need to know to participate in a GitOps workflow for endpoint configuration:

1. How to clone a repository
2. How to create a branch
3. How to make changes to a file
4. How to commit those changes
5. How to open a pull request

That's it. That's the baseline. You don't need to understand rebasing or cherry-picking or detached HEAD states (hell, I don't understand any of that stuff and I use git nearly every day). You don't need to memorize fifty git commands. You need to understand five basic operations, and most of them have good GUI tools if the command line feels intimidating.

Is this harder than clicking a button in a web interface? Yes. Marginally.

Is it so much harder that we should accept all the downsides of clickops to avoid teaching it? No.

## What we're actually giving up with clickops

Every time you make a configuration change by clicking through a web interface instead of committing code, here's what you're losing:

**You lose visibility into when changes happened.** Without git history, you're relying on whatever audit logging the tool provides - if it provides any. Good luck filtering through thousands of log entries to find the one change that broke something.

**You lose visibility into what changed.** What was the old value? What's the new value? With clickops, you're often flying blind unless you took detailed notes. With git, `git diff` shows you exactly what changed.

**You lose visibility into who made the change.** Sure, your MDM might log who clicked the button. But do you know *why* they made the change? What was the context? Git commits can include that context. Audit logs generally don't.

**You lose the ability to roll back cleanly.** Something broke? With git, you revert the commit. With clickops, you're trying to remember what the configuration looked like before, clicking through interfaces to manually undo changes, hoping you got everything.

This is invisible technical debt. Every change you make through a GUI that isn't captured in code is a liability you're carrying forward. You're betting that you'll remember, that your documentation is current, that the person who made the change is still around when you need to understand it six months from now.

We don't accept this in infrastructure. We don't accept this in application deployment. Why are we accepting it for endpoint management?

## What you gain with GitOps

The benefits are the mirror image of everything clickops costs you:

**You get a complete history.** Every change, when it happened, who made it, and why. Not just "user clicked save" in an audit log, but actual context about the decision.

**You get diff-able configuration.** You can see exactly what changed between any two points in time. You can compare your production configuration to your staging configuration. You can track down when a specific setting was introduced.

**You get easy rollbacks.** Something broke? Revert the commit. You're back to a known-good state in seconds, not hunting through interfaces trying to remember what you changed.

**You get code review.** Before a configuration change goes live, someone else can look at it. Catch mistakes before they affect production. Share knowledge across the team.

**You get a single source of truth for audits.** When auditors ask "how do you know your configurations are correct and haven't been tampered with?" you can point to your git repository. It's versioned. It's signed. It's exactly what's running in production.

This isn't just about technical benefits. This is about reducing stress for your team. It's about being able to sleep at night knowing you can recover from mistakes. It's about onboarding new team members by showing them the git history instead of hoping the documentation is current.

## Testing your configuration before it touches production

Here's something you absolutely cannot do with clickops: automated testing.

With configuration as code, you can write tests that validate your changes before they ever reach production. Syntax errors? Caught before merge. Logical contradictions in your configuration? Caught before merge. Security misconfigurations that would expose sensitive data? Caught before merge.

This is standard practice in software development. Every code change goes through automated tests before it ships. We should be doing the same thing with our endpoint configurations.

What does this look like in practice? Your CI/CD pipeline can:

**Validate syntax.** Is your YAML valid? Is your JSON properly formatted? Does your configuration file actually parse? Basic stuff, but these errors happen, and finding them in production is embarrassing and disruptive.

**Check for conflicts.** Are you setting the same value in multiple places? Do you have contradictory settings that will cause undefined behavior? Tests can catch these before they confuse your devices.

**Enforce security policies.** Is FileVault enabled? Are device passwords meeting your complexity requirements? Are you accidentally allowing unsigned software? Write tests that verify your security posture is what you think it is.

**Validate against your fleet inventory.** Are you trying to deploy a macOS configuration to Windows devices? Are you targeting a team that doesn't exist anymore? Tests can check that your configurations align with reality.

**Verify logical dependencies.** Does this configuration require another setting to be enabled first? Are you trying to use a certificate that hasn't been deployed yet? Catch these ordering issues before they cause deployment failures.

When someone opens a pull request to change a configuration, these tests run automatically. If they fail, the PR doesn't merge. The mistake never reaches production. Your users aren't affected by the broken configuration.

With clickops, you don't get any of this. You click save, the change goes live, and you find out it was wrong when devices start behaving strangely or users start complaining. You're testing in production whether you meant to or not.

Yes, writing tests is additional work. Yes, it's another thing to learn. But would you rather spend 30 minutes writing a test that runs automatically forever, or spend 3 hours debugging why devices are misbehaving because a configuration value was wrong?

The test pays for itself the first time it catches a mistake. Every time after that is pure savings.

## Teaching git as a fundamental skill

Here's what I think we should be doing: treat git as a fundamental skill for IT professionals at all levels.

Not "git for developers." Not "advanced git techniques." Just basic git literacy. The same way we expect helpdesk staff to understand basic networking concepts, we should expect them to understand basic version control concepts.

This isn't about dumping git on people and expecting them to figure it out. This is about recognizing that version control is increasingly foundational to modern IT operations, and we should be teaching it explicitly and well.

Start with the basics. Use GUI tools if the command line is intimidating. Focus on the workflow - clone, branch, commit, PR - and the *why* behind each step. Make it relevant to the work people are actually doing.

Your junior engineers can learn this. Your helpdesk staff can learn this. I know this because I've taught junior engineers and helpdesk staff to do it successfully. The barrier isn't capability. The barrier is our assumption that it's too hard, combined with our unwillingness to invest in teaching it properly.

## The real question

The question isn't "is GitOps harder than clickops?" Of course it is. Marginally.

The real question is: "Is the small upfront cost of learning git worth the massive ongoing cost of not having version control for our configurations?"

And if you're honest about the costs - the debugging time, the stress, the audit headaches, the institutional knowledge that walks out the door when someone leaves - the answer is obvious.

Other IT disciplines figured this out years ago. Infrastructure as code isn't controversial anymore. It's just how things are done. Configuration as code for endpoints should be the same.

We're not special. We're not different. We have the same problems other disciplines solved with version control, and we should use the same solutions.

The future of endpoint management is configuration as code. The only question is how long we're going to keep clicking before we start committing.
