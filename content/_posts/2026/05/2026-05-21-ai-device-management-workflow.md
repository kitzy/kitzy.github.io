---
layout: post
title: "How to actually use AI to manage your fleet"
description: "The repo is the surface. The instructions file is the manual. The human review keeps it safe."
date: 2026-05-21
tags: [work, AI, mac admin, fleet]
---

I [made the case last month](https://kitzy.com/blog/device-management-about-to-change-ai-gitops/) that without GitOps, there is no AI-accelerated device management. The AI needs a surface to work against, and a GUI isn't one. That part stands. But I left out the next question: assume you have the repo. Now what?

One thing before we get into it: the examples below are Fleet and Claude Code because those are the tools I use. The pattern is the same for any MDM with a config-as-code surface and any AI coding agent - your specifics will differ, but the workflow shape won't. Translate as you read.

If you point an AI coding agent at a vanilla MDM repo and prompt it to add a profile, you'll get something back. It might even apply cleanly. It also might quietly overwrite an existing profile because it reused the identifier from the file it copied. It might reference an osquery column that doesn't exist. It might use an app slug that fails at apply time because nobody told it to check the slug exists. It might wire a secret reference that expands to an empty string because the workflow file that maps secrets in never got updated.

The structure of the repo is legible. The conventions that make the repo *correct* are not - at least not from the file tree alone.

You need to write those down. That's what a `CLAUDE.md` is for.

## The thing you can't infer from the tree

Here's what an AI can figure out by reading your repo: the directory layout, the naming conventions, the YAML style, the shape of your existing policies - what fields you use, how you scope to teams, how you set severity. That's enough for "write me a new policy that looks like the others" to work most of the time. It's not enough for that policy to be *correct*.

What it can't figure out from the tree:

- That you prefer DDM declarations over `.mobileconfig` profiles whenever the setting is available either way, because DDM is Apple's modern, status-aware model
- That `path:` values resolve relative to the file containing them, not the repo root, so a path that works in `default.yml` will be wrong if you copy it into a file in `fleets/`
- That `fleetctl gitops` runs with `--delete-other-fleets` enabled by default, so removing a fleet file actively deletes the team in Fleet on the next apply
- That `managed_policies` only reflects legacy `.mobileconfig` profiles, so verifying a DDM-delivered setting against it will always return wrong results
- That Fleet Maintained App slugs have to be looked up at `fmalibrary.com` because they don't always follow a predictable pattern from the app name
- That the Fleet osquery schema diverges from upstream osquery in ways the AI's memorized table knowledge doesn't account for

None of this is hidden in some clever sense. It's all written down somewhere - in Fleet's docs, in Apple's developer docs, in your workflow file, in the bash script that calls `fleetctl gitops`. But the AI isn't going to go reading the bash script in `.github/fleet-gitops/` to figure out that you've enabled `--delete-other-fleets`. It's going to assume the default behavior is what it remembers from training, and confidently propose a change that does something different than you expected.

So you tell it. In a file at the root of the repo. Called `CLAUDE.md`.

Quick note on the filename: mine is `CLAUDE.md` because that's the convention Claude Code reads. If you're using a different agent, the convention is different - `AGENTS.md` for Codex and a growing list of others, `.cursor/rules/` for Cursor, `.github/copilot-instructions.md` for GitHub Copilot. The filename varies. The concept doesn't: a plaintext file at the root of the repo that tells the AI the rules it can't infer from the tree. For the rest of this post I'll just say `CLAUDE.md` because that's the one in my repo - read it as whatever your tool wants.

## What goes in it

[Here's mine.](https://github.com/kitzy/fleet-gitops/blob/main/CLAUDE.md) It's been growing as I notice the things the AI gets wrong, and it now reliably catches most of them.

The shape that's worked for me has four layers.

**Authoring preferences.** Architectural choices you'd otherwise have to repeat in every prompt. "Prefer DDM over `.mobileconfig` whenever an equivalent declaration type exists." That single line means I don't have to say it again. Every PR the AI opens defaults to a DDM declaration when one's available, and falls back to a config profile only when DDM doesn't cover the setting yet.

**Verification gates.** Pointers to canonical schema docs the AI should check before guessing. The Apple DDM declaration reference. The Fleet YAML config reference. The osquery table schema. The Fleet Maintained App library. The AI's training data on any of these is stale or wrong in places, and saying "verify against this URL before writing" is the difference between a PR that applies cleanly and one that fails on the first run.

**Gotchas the file tree can't show.** The path resolution rule. The identifier regeneration rule when duplicating a `.mobileconfig`. The bare-list format that files in `labels/` have to use. The secrets wiring that has to happen in two places in the workflow file. The `--delete-other-fleets` default. These are the things that would take a human admin a week of stepping on rakes to learn, and the AI will hit every one of them in its first session without this file.

**Verification approach for managed state.** This one's specific to Fleet but the pattern generalizes: for each kind of setting, where do you check that it actually applied? For me, the rule is: native osquery table if one exists, declaration-presence check against the DDM state persistence plist if not, and avoid `managed_policies` and `preferences` entirely for DDM-delivered settings because they'll lie to you. That's not something the AI can infer - it's domain knowledge about how Apple's declarative management model works in practice.

A few patterns I've landed on: be specific about *why*, not just *what*. "Use DDM" is a rule; "Use DDM because it's Apple's modern, status-aware model, and fall back to `.mobileconfig` only when no equivalent DDM declaration type exists" is a rule the AI can apply to cases I didn't anticipate. Link the references inline - don't just say "check the docs," say "check `https://fleetdm.com/tables` before writing any `FROM` or `JOIN` clause," and the AI follows the link. Write in sentences with reasoning, not bullets-of-bullets - the AI understands prose better than it understands compressed lists.

## Treat it like onboarding

A `CLAUDE.md` is like a runbook for a junior engineer. Specifically, the kind who's technically capable, learns fast, has read a lot, hasn't worked on *your* repo before, and will absolutely do things you didn't anticipate if you don't tell them not to.

You wouldn't onboard a new hire onto your team and turn them loose on your MDM with no training, no context, no list of the rakes you've already stepped on. You'd sit them down. You'd tell them about the time the path resolution thing bit you. You'd tell them why you prefer DDM. You'd point them at the docs you actually use. You'd watch their first few PRs closely and give specific feedback. You'd add to their onboarding doc as you noticed things they didn't know.

That's the relationship with the `CLAUDE.md`. Same shape, same loop. Every time you catch the AI making a mistake, write it down. The file pays for itself the next time. The rules you keep repeating in prompts are rules that belong in the file. The corrections you give in PR review are corrections that belong in the file. The links to docs you keep finding yourself pasting are links that belong in the file.

The version that lives in my repo right now is the one I have because the AI got things wrong often enough that I added a line to prevent it from happening again. It isn't a clever artifact. It's a sediment layer of every mistake worth not making twice.

Skip this part and you're doing the equivalent of hiring someone smart and motivated and then declining to tell them anything about how your team actually operates. They'll do their best. They'll also break things you'd have wanted to warn them about. The model doesn't change just because the engineer is an AI.

## What the workflow actually looks like

With the repo and the `CLAUDE.md` in place, here's the loop.

Something happens that should change device state - a new security directive, a compliance ticket, a vendor announcing a critical CVE, an operational request from a team. Whatever it is, it's usually a sentence-long description of intent.

You drop that sentence into Claude or Cursor or Copilot or whatever you're using, pointed at the repo: "Set the macOS software update deferral to 14 days for the Engineering team."

A pull request shows up. The declaration lands in `platforms/macos/declaration-profiles/` because the AI checked the Apple DDM reference, found `com.apple.configuration.softwareupdate.settings` is an available declaration type, and used it per the "prefer DDM" rule in the `CLAUDE.md`. It's scoped to Engineering using the label pattern that already exists in the repo. The `Identifier` is freshly generated, not copied from the template the AI used as a starting point. The PR description references the triggering request. None of that was in the prompt - the repo told the AI what to do, and the `CLAUDE.md` told it the rules.

A human reviews the PR. The AI can only propose; it can't merge, can't deploy, can't touch a single device. That's the human-in-the-loop model: the AI gets to be fast, the human stays in charge. The whole safety model lives at the review step. I wrote about this trust model [in the last post](https://kitzy.com/blog/device-management-about-to-change-ai-gitops/), and I keep coming back to it because it's the part people skip past and then later wish they hadn't.

The human merges. CI runs `fleetctl gitops`. The change applies.

The whole thing, end to end, on a small policy, is minutes. The slow part used to be writing the YAML, looking up the schema, scoping correctly, getting it past review on the first try. That's the part that's gone. What's left is judgment - which, honestly, is the part I'd rather be doing anyway.

## The review is the job now

I want to be careful about the framing here, because there's a version of this that sounds like "AI replaces the work." It doesn't.

What it replaces is the *transcription* - the part that turned a clear intent into the right YAML in the right place. That part is gone. What's left is the part that was always the harder part:

Does this policy actually address the risk we care about, or did the AI optimize for the wording of the prompt and miss the underlying intent? Is the scope right? Engineering is what was asked for, but does Engineering share infrastructure with another team this should also cover? Is the severity calibrated against our other policies, or is it an outlier that's going to drown out signal? Did the AI catch the existing profile that overlaps with this one, or are we about to ship a duplicate? Did it pick the right verification table, or is it using `managed_policies` for a DDM-delivered setting? Is the PR description honest about what this does, or is it slightly oversold in a way that's going to mislead whoever comes after me?

Some of these the `CLAUDE.md` handles. Most of them are still on you. The Mac admin job didn't go away - it shifted toward the parts of the work that always required actual expertise. The parts where you have to know your fleet, your org, your incident history, your security model.

I don't know exactly how this rebalances across a team. Maybe the ratio of authoring to reviewing flips, and the people who used to spend their days writing YAML spend them reviewing PRs and tightening the `CLAUDE.md` instead. Maybe the same person does both in less time. Maybe the freed-up capacity goes into the harder problems that have been on the backlog forever - the cross-platform parity work, the report dashboards nobody had time for, the runbook gaps. Maybe it goes into headcount cuts, which would be the worst version. The technology doesn't determine which.

What I can say is that the people I know doing this well are not less busy. They've just moved up the abstraction stack.

## Could you do this on Monday?

Same question I closed the last post with.

If your config is in a repo, the answer is now closer to yes than it was a month ago. The gap is smaller than it looks. You need the repo - already required. You need a `CLAUDE.md` at the root, written like a runbook for a new hire; start with what you already know the AI gets wrong, and let it grow. You need a prompt-to-PR habit; stop authoring YAML by hand, because authoring is what the AI is for and reviewing is what you're for. And you need the discipline to keep the human in the loop - to keep merging through review even when the change is small and the AI is right. The review is what makes the speed safe.

That's most of it. The tooling already exists. The model is already smart enough. The repo is the surface. The `CLAUDE.md` is the manual.

The slow part is gone. The careful part is still on us.
