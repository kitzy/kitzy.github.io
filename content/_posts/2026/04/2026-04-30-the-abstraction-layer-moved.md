---
layout: post
title: "The abstraction layer moved. The responsibility didn't."
description: "AI didn't change whether you need to understand what you ship. It changed how much of it you wrote yourself."
date: 2026-04-30
tags: [AI, mac admin]
---

Ideas were never the bottleneck.

For years the constraint wasn't knowing what to build - it was the distance between the idea and the working implementation. The skills gap. The time gap. The gap between being able to describe a solution precisely and being able to produce it.

AI compressed that distance. And that's genuinely liberating - and also where I think a lot of the current anxiety in our community is coming from.

Sam Mills wrote something this week that I keep thinking about. His [piece on engineering in the age of AI](https://mostlymac.blog/2026/04/28/engineering-in-the-age-of-ai/) is worth reading carefully. Not just because I agree with parts of it, but because where I don't, the disagreement reveals something important about what we're actually talking about when we talk about AI in this community.

Sam's core claim: AI removes friction, and the friction is where the learning lives. When you outsource the struggle, you lose the understanding. And without understanding, you can't maintain what you ship, can't catch what goes wrong, can't be accountable for the outcomes. He calls the human engineer the "moral crumple zone" - kept in the loop just enough to absorb blame, without the context to prevent failure.

That's a real concern. I want to take it seriously before I push back on it.

## You own what you ship

Think about what it means to ship something that runs on other people's machines.

Every time a policy deploys, every time a script runs, every time a configuration change propagates across a fleet - something happens to real devices in real environments, managed by real people who trust that the tool does what it says it does. When something breaks, nobody is filing a ticket with the AI model that helped write the code. They're filing one with you.

That's not a hypothetical. That's just how accountability works.

Which means you have to understand what your code is doing at every step. Not just the happy path - the edge cases. What happens when an upload fails partway through? What happens if a branch already exists? What happens under the specific conditions that your tests didn't cover? If you can't answer those questions, you don't own the code. You're just the person whose name is on it.

That's the minimum. Not because AI-generated code is uniquely bad - it's not - but because ownership means being able to maintain it, debug it, and defend it when something goes wrong. The tool doesn't get paged at 2am when something breaks. The model doesn't have a job on the line. You do.

So Sam's not wrong about accountability. I think we disagree about which friction is doing the teaching - and about what the actual job is.

## No one should one-shot their infrastructure

Sam warns against using an agent to "one-shot" your infrastructure. He's right to warn about it. But I want to be specific about what makes it wrong, because I don't think the problem is AI. The problem is skipping the design work.

"Manage my devices" is not a prompt. It's an abdication.

The real work - the work that requires your expertise, your judgment, your understanding of your organization - happens before you write a line of code or craft a single prompt. What are you trying to accomplish? What's the actual problem? What does success look like, and how will you know when you've achieved it? What are the tradeoffs, and who bears the cost of each one? Which things are genuinely important, and which are you doing because they feel like things you should be doing?

That's where the expertise lives. Not in knowing the right key-value pair. Not in remembering command syntax. Not in looking up whether the correct key is `labels_include_any` or `include_any_labels`. That knowledge matters - you need to be able to verify the output is correct - but the ability to recall it from memory is not what makes someone a good platform engineer. What makes someone good at this work is knowing what to build, knowing whether to build it at all, and understanding the downstream implications of the choices they make.

If you've done that work - if you can describe the intended behavior precisely, if you know what the right answer looks like before you ask AI to help you express it - then AI doesn't bypass your expertise. It amplifies it. If you skip that work and hand the problem to an agent wholesale, you don't get AI-assisted engineering. You get expensive autocomplete applied to a problem you haven't thought through.

The failure mode Sam is describing is real. It's just not a failure of AI. It's a failure of design.

## Another abstraction layer

We don't write binary. We don't write machine code. Most of us can't even read machine code - and that's fine. We write in high-level languages that compile down, and we trust the compiler to produce correct output because we understand the language well enough to evaluate what it's doing and catch it when it's wrong.

What AI lets us do is take that one level further. Instead of translating intent into high-level code, we're translating intent into natural language, and letting the AI produce the code. The abstraction layer moved. The skill required didn't disappear - it shifted.

When you review a compiled binary, you don't read every instruction. You trust the compiler and run tests. When you review AI-generated configuration, you don't rewrite it from scratch. You read it, understand it, test it, and take responsibility for it. The review step is real work. The understanding is not optional. But the fact that you didn't produce the initial draft by hand doesn't mean you don't own the output.

Before AI tooling, there was a rough correlation between "code I understand" and "code I wrote." Not perfect - libraries, dependencies, Stack Overflow snippets - but close enough that most people didn't think about it explicitly. Now that correlation is much weaker, and that's where I see people getting into trouble. The temptation is to treat "it compiled and the tests passed" as sufficient review. It isn't. Tests can only catch what they test for, and you can only write good tests for things you understand might go wrong.

This is also why the GitOps workflow matters so much here. When your configuration lives in a repository and changes land in pull requests, AI output becomes legible. It's text, in a hierarchy, with conventions you can read and diff and push back on. The AI submits the PR. A human reviews it before it touches a single device. That's not removing the friction that matters - it's creating the surface where friction can happen productively, the same way code review does in software engineering.

Sam says "the logic behind a declarative model is solid." I agree. Declarative management and AI-assisted authorship aren't in tension - they're complementary. The former is what makes the latter safe.

## The QA side is still entirely yours

None of this changes the testing requirement. It makes it more important.

When you can ship faster, you can also break things faster. The cost of bad QA is the same; the speed at which you find out about it compresses. In endpoint management, a bad configuration doesn't produce a 500 error on a webpage - it produces a broken machine in front of a person trying to do their job.

You designed the solution. You know what it's supposed to do. You're the one who has to verify that it does that thing, in your environment, for your fleet, against the edge cases you know about. AI can help write tests. It can't tell you which tests matter for your specific situation. It doesn't know your org's risk tolerance, your users' workflows, or the quirks your fleet inherited three years ago and has never fully documented.

Staged rollouts, code review, actually reading the output before you ship it - these aren't bureaucracy. They're the job. The tools changed. The discipline didn't.

## The regression to the mean

This is Sam's strongest point, and I want to sit with it honestly.

He argues that LLMs can't produce outlier thinking - that by design, they produce clustered answers that regress toward the average of what's been said before. All great engineering and strategy happen at the edges. So AI can't produce great engineering.

I think this is partially right, in a way that matters. And I think it's mostly irrelevant to what most of us actually do every day.

Device management, especially in the Apple space, is largely a solved problem. Apple's MDM spec is well-documented. Configuration profiles have a known structure. FileVault works a specific way, and there's a correct way to configure it. Wifi configurations, password policies, software deployment - we know how these work. We've known for years. The best practices are written down. The community has already figured out most of it.

Writing a FileVault configuration profile by hand isn't groundbreaking. You're not going to find a better way to encrypt your devices. If you're constantly reinventing the wheel while managing your fleet, you're probably doing something wrong. Most of us aren't hand-crafting config profiles today anyway - we're using tools that generate them when we check boxes in a GUI. That's just a different abstraction layer over the same solved problem.

Sam's right that great engineering happens at the edges. The edges are just not where most device management work lives. I'd estimate that 80% of the work is mundane, well-understood, and templated. It's the 80% I'm advocating for handing to an LLM - not because it doesn't matter, but because doing it well doesn't require your best thinking. It requires accuracy and consistency, which AI handles fine under human review.

The goal is to free up capacity for the 20%. The hard stuff. The architectural decisions specific to your environment, your risk tolerance, your users. The problems that don't have a Stack Overflow answer. The judgment calls where your institutional knowledge and domain expertise actually matter and can't be templated.

AI is a bad source of novel strategic thinking. Use it that way and Sam's critique lands. But if you're using it to handle the solved problems so you can spend more time on the unsolved ones - that's not atrophying your skills. That's directing them where they're most valuable.

## Where Sam and I actually agree

I don't want to frame this as a rebuttal, because it's not entirely one.

The concern about engineers who stop caring, who treat AI output as a box to check rather than a thing to understand, who ship configurations they can't defend when something breaks - that's real. The temptation to skip the comprehension step is real, and some of the people who give in to it will be responsible for systems that matter.

Sam's advice - use AI to understand a problem, not to solve it for you - is probably the right heuristic for a lot of contexts. Especially in high-stakes environments. Especially for engineers still building foundational skills.

The MacAdmin community has legitimate reasons for a skeptical viewpoint here. We value deep technical knowledge. We work in environments where understanding what's happening under the hood matters. The move-fast-and-break-things ethos has never been our culture, because the things that break aren't products - they're the computers people use to do their jobs.

The answer isn't to reject the tools. It's to use them with the same discipline we'd apply to anything else: do the design work before you write a line of anything, understand what you're deploying, build the feedback loops to know when something broke, and treat the review step as real work rather than a formality.

The amplifier doesn't own the output. You do.
