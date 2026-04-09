---
layout: post
title: "The bottleneck moved. Are you ready for it?"
description: "AI is making code cheaper to write. That means the constraint in software development, and device management, has shifted to product design and QA."
date: 2026-04-09
tags: [work, AI, projects, mac admin]
---

For most of software development's history, the constraint was writing code. You had an idea, and then you needed someone who could translate that idea into something a computer would execute. That translation step - the actual typing of syntax, the knowing which functions to call and which abstractions to build - was expensive, slow, and scarce.

So we built everything around it.

We hired armies of engineers. We invented sprint planning and story points and velocity metrics, all in service of answering one question: how do we get more code written faster? Product managers existed largely to organize demand around the supply of developer time. QA teams were chronically underfunded because there was never enough time left in the sprint after the "real" work was done.

That assumption is breaking.

## The bottleneck moved

AI models can write code now. Not perfectly, not without supervision, but well enough that a single engineer with good AI tooling can ship what used to require a team. The translation step - turning an idea into working software - is getting dramatically cheaper and faster.

What hasn't gotten cheaper is knowing what to build.

Product design, in the real sense - not the "make the buttons pretty" sense, but the hard work of figuring out what problem you're actually solving, for whom, and how you'll know if it worked - is still entirely human labor. It requires talking to users, sitting with ambiguity, making judgment calls about tradeoffs that don't have objectively correct answers. AI can help, but it can't replace the work of understanding what people actually need versus what they say they need.

And QA is, if anything, getting harder. When you can generate more code faster, you also generate more surface area to test. More edge cases, more integration points, more ways things can break in production. The code ships faster; the consequences of shipping broken code are the same.

So the bottleneck moved. It's not "can we write this?" anymore. It's "do we know what to build, and do we know if it works?"

## What this means for teams

I expect to see team structures shift significantly over the next few years. Not because companies will make thoughtful decisions about this, but because the pressure is obvious once you see it.

The engineers who will be most valuable aren't the ones who can type the most code. They're the ones who can direct AI tools effectively, review and critique generated code, and - maybe most importantly - know when the thing the AI produced is technically correct but architecturally wrong. That's a different skill than raw implementation speed.

Product design roles will grow in importance. Not product management in the "write the ticket" sense, but actual design thinking: what are we building, for whom, does it solve the right problem. That work can't be delegated to a model.

And QA - which has been chronically treated as optional or tack-on - is going to have a moment. Not because it becomes glamorous, but because the cost of bad QA will become visible faster. When you can ship a feature in a day instead of a sprint, the feedback cycle on broken features compresses too. Companies that can't test reliably will ship faster and break more.

This isn't a prediction about some distant future. In February, [Block laid off more than 4,000 people](https://www.cnn.com/2026/02/26/business/block-layoffs-ai-jack-dorsey) - nearly half its staff. Jack Dorsey didn't bury the reason. He cited AI directly in his shareholder letter, and predicted most companies would make the same call within a year. Block's CFO put it even more plainly: smaller teams, AI doing more of the work, moving faster. Investors loved it. Block's stock jumped 24% on the news.

That's what the pressure looks like in practice. The restructuring isn't coming. It's happening.

Maybe some of this is obvious. Or maybe it's the kind of thing that's obvious in retrospect and everyone pretends they saw it coming.

## Ownership doesn't compress

Here's what none of this changes: someone has to be responsible for the code.

AI can generate it, but it can't own it. It can't be paged at 2am when something breaks in production. It can't stand in front of a customer and explain what went wrong. It can't be held accountable for a security vulnerability that shipped because nobody read the output carefully enough. The model doesn't have a job on the line. You do.

This matters more, not less, as the tools get more powerful. When you're writing every line yourself, you have an intimate understanding of what the code does and why. When an AI writes it and you review it, that understanding has to be deliberately constructed - you have to actually read it, question it, push back on it, run it. The temptation to treat "it compiled and the tests passed" as sufficient review is real, and it's a trap.

The engineers who get into trouble with AI tooling are the ones who confuse speed of generation with quality of understanding. Shipping fast is only valuable if you know what you shipped. And when something breaks - not if, when - "the AI wrote it" is not an explanation anyone will accept, nor should they.

Ownership means you understand the code well enough to defend it, debug it, and take responsibility for what it does. That hasn't changed. If anything, the ease of generation makes it a more important discipline to maintain, not less.

## The planning overhead is next

Story points were never really about time. They were about relative effort - a way to surface and negotiate the variance between tasks so you could make sensible commitments. A 13-point story versus a 3-point story represented a real difference in how you'd fill a sprint, what you'd commit to, what you'd cut. That variance was meaningful enough to justify the ceremony around it.

AI compresses the variance. Not to zero, but enough that the signal-to-noise ratio on estimation starts to invert. If a task that used to take three days now takes three hours, the gap between "easy" and "hard" shrinks dramatically. You're running planning poker to optimize around a difference that barely exists anymore.

And here's the thing: the estimation complexity doesn't disappear. It moves. It moves to exactly the work that's always been hardest to point - the design work, the "what are we actually building and why" work, the figuring-out-if-it-worked work. That stuff resists story points because it's genuinely uncertain in ways that implementation isn't. You can estimate how long it takes to build a feature once you understand it. You can't reliably estimate how long it takes to understand it.

So the overhead that exists to manage implementation variance becomes increasingly useless precisely as the need to grapple with design uncertainty grows. The meetings that used to prevent wasted work start becoming the wasted work.

I don't think sprint planning disappears overnight. But I'd expect teams to start quietly dropping the estimation ceremonies first - not because they got sloppy, but because they stopped being worth the time.

## The same thing is happening in device management

I've been thinking about this a lot in the context of CPE teams, because the parallel is pretty direct.

Configuration as code, GitOps workflows, declarative management - these are the same structural shift. The constraint used to be "can someone write and maintain this configuration?" Building and maintaining Munki catalogs, AutoPkg recipes, MDM profiles - all of it took real technical effort. That was the bottleneck. How fast could your team ship configuration changes?

AI tooling makes that translation step cheaper. Not free, not perfect, but cheaper. A skilled CPE with good tooling can ship changes faster than they could before.

Which means the bottleneck moves for CPE teams too.

The question stops being "can we write this?" and becomes "do we know what to change, and do we know if the change worked?" That's product thinking, applied to device management. It's understanding the fleet, understanding the users, understanding the tradeoffs between security posture and friction. It's testing changes before they roll out to 10,000 devices.

The CPEs who thrive in this environment won't necessarily be the ones who can write the most sophisticated profiles from scratch. They'll be the ones who can direct the tools effectively, evaluate what gets generated, understand the downstream implications of a configuration change, and build the feedback loops to know when something broke.

That last part - the feedback loops - is why I care so much about configuration as code and declarative management. When your configuration lives in version control, when changes go through review, when you have audit trails and rollback capability, you're building the infrastructure to learn from mistakes quickly. The speed of the tools only helps you if you can also learn fast when they get something wrong.

## What I'd actually pay attention to

If I were thinking about where all of this lands in practice, I'd watch for a few things.

Teams that survive and grow will be the ones that get good at shipping changes quickly and safely. Not just quickly - that part is increasingly table stakes. The "safely" part, the testing, the staged rollouts, the observability - that's the differentiator.

The people who become indispensable will be the ones who can reason clearly about what a change is actually doing and why. AI can help write it. It can't replace the judgment about whether it's the right change for your environment.

And organizations that still treat QA as optional - in software development or in device management - are going to have a rough time. The tools are faster now. The cost of not testing is the same.

The bottleneck moved. Are you ready for it?
