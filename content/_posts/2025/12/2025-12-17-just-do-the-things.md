---
layout: post
title: "Just do the things"
description: "Stop waiting for permission to contribute. Find a gap, start before you're ready, and learn what you need along the way. Growth happens outside your comfort zone."
date: 2025-12-17
tags: [career, life, community]
---

I saw an [exchange on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7407094006062424064?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7407094006062424064%2C7407103743801851904%29&replyUrn=urn%3Ali%3Acomment%3A%28activity%3A7407094006062424064%2C7407170104209297408%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287407103743801851904%2Curn%3Ali%3Aactivity%3A7407094006062424064%29&dashReplyUrn=urn%3Ali%3Afsd_comment%3A%287407170104209297408%2Curn%3Ali%3Aactivity%3A7407094006062424064%29) recently between Arek Dryer and Anthony Young that perfectly captures something I've been thinking about:

> **Arek Dreyer:** What’s a piece of advice for someone who’d like to get involved like you’ve done?

> **Anthony Young:** “Just do it” 😂 but no, in all honesty, the one thing I have to tell myself over and over and over again is just do the things. My 2025 goal was to grow “me”. Grow my personal brand, grow my knowledge, grow my involvement. There are a million different things one can get involved in - pick just a few to go at it and be uncomfortable getting started in it. The community itself, specifically the Mac Admins community, has been great to me to allow me to take up space and participate and my participation is a way of giving back to that very same community - so everybody ultimately wins. Just start, and keep just starting and soon you’d be doing a year in review like “where’d the time go??”

He's right. Nobody's going to tap you on the shoulder and say "you're ready now."


## Here's what that looked like for me

I use AutoPkg to automate software packaging. Fleet has package management built in. But there was no way to add packages to Fleet directly from AutoPkg runs. I had to manually upload them through the UI.

That's a gap. Not a catastrophic one. Not something that was blocking my work completely. Just an annoying friction point that wasted time and broke my workflow.

Nobody at Fleet asked me to solve this. The AutoPkg project wasn't waiting for someone to build a Fleet processor. But the problem was real, and I knew other Fleet users wanting to use AutoPkg would hit the same friction.

So I built [FleetImporter](https://github.com/autopkg/fleet-recipes), a custom AutoPkg processor that adds packages directly to Fleet.


## Start before you're ready

Here's what I didn't do: wait until I knew how to build an AutoPkg processor.

I'd never written one before. I had to read through AutoPkg's processor documentation, look at how other processors were structured, figure out Fleet's API endpoints, and debug why my first several attempts didn't work.

I asked questions in the AutoPkg Slack when I got stuck. I shared early versions with colleagues at Fleet to get feedback on the API implementation. I pushed code that wasn't perfect because getting it working mattered more than getting it flawless.

That's what starting uncomfortable actually means. Not "I felt a bit nervous but I was actually totally prepared." More like "I genuinely didn't know what I was doing and had to figure it out as I went."

Here's the thing: I still don't feel like I _really_ know how to build an AutoPkg processor. But I know more about it than I did when I started. And that's all that matters.

You don't need to master something to contribute value. You just need to be curious enough to solve the problem in front of you. Everything else you learn along the way.


## Discomfort is the point

If you're comfortable, you're not growing. You're just doing things you already know how to do.

Your comfort zone only expands when you push past its edges. If you stay inside it, doing the same things you've always done, you stagnate. Your skills plateau. Your knowledge stops growing. You become really good at the things you already know, but you never learn anything new.

This isn't a bug. It's a feature.

That feeling of "I have no idea what I'm doing" when you start building something new? That's exactly where you should be. That discomfort means you're learning. It means you're expanding what you're capable of.

When I started writing FleetImporter, I was uncomfortable because I didn't know how AutoPkg processors worked. Now I kind of do. My comfort zone expanded. The next processor I write won't feel as hard.

When we started the Mac Admins Slack, we didn't know how to moderate a community at all, let alone at scale. We learned by doing it. By making mistakes. 

The pattern is always the same: start uncomfortable, push through it, end up capable of something you couldn't do before. Then find the next uncomfortable thing.

If you're never uncomfortable, you're never growing.


## Failure is always an option

Adam Savage used to say this on Mythbusters, and I took it as a valuable life lesson.

Failure isn't _really_ failure if you learn something from it. If you walk away from every attempt with a lesson about what doesn't work, or why something broke, or how to approach it differently next time, then that time wasn't wasted. You're smarter than you were before you started.

My first few attempts at FleetImporter didn't work. I had to debug API calls, figure out why packages weren't uploading correctly, and rewrite large chunks of code when I realized my approach was wrong. 

I threw the whole thing out and started completely over at least three times. Not "refactored a few functions" - scrapped _everything_ and rebuilt from scratch. Each time I thought I understood how it should work, I'd hit a wall that made it clear my mental model was wrong. Eventually I got to something that actually worked.

Every failure taught me something about how AutoPkg processors work or how Fleet's API expects data to be structured. The time I spent on versions that didn't work wasn't wasted - each failed attempt made the next one better.

The Mac Admins Slack made plenty of mistakes in the early days. We had to figure out moderation policies after situations came up that we hadn't anticipated. We learned what worked and what didn't by trying things and adjusting when they failed.

Time spent failing is still time well spent if you're learning. The only real failure is not trying at all.


## Why we wait (and why we shouldn't)

The impulse to wait for permission comes from somewhere real:

**"I'm not expert enough."** You don't need to be the world's foremost expert. You just need to know more than the person who's struggling with the problem you're solving. If you figured something out that took you three hours of trial and error, writing it down saves the next person those three hours.

**"Someone else is probably already working on this."** Maybe. But if you haven't found their solution, neither has anyone else. And even if someone is working on it, two approaches to the same problem often surface different insights.

**"What if I do it wrong?"** I've done plenty of things wrong. For every thing I've gotten right, I've probably done ten things wrong. My first few attempts at FleetImporter didn't work. I've written blog posts that needed corrections. I've given conference talks where I stumbled over explanations or realized later I could have explained something better. We made  moderation decisions in the MacAdmins Slack that we had to walk back.

None of that stopped the work from being valuable. People still use FleetImporter. The blog posts still help people even after I've updated them. The talks still landed even if they weren't perfect. The Slack community still grew.

Version two is always better than version one. But version one has to exist first.

**"I don't want to step on anyone's toes."** Most people in open communities are happy when someone steps up to solve a problem. If you're genuinely worried about overlap, ask early. Share your work-in-progress and see what feedback you get. But don't let theoretical toe-stepping stop you from starting.


## What starting actually looks like

When we started the Mac Admins Slack in 2015, we didn't have a detailed plan for running a community that size. We just knew that the existing forums and mailing lists weren't meeting our needs for real-time discussion and quick answers.

We set up a Slack workspace. We invited people we knew. Those people invited others. We figured out moderation policies as situations came up. We made mistakes and adjusted. Now it's over 80,000 members.

Starting doesn't require a perfect plan. It requires noticing a problem and taking the first step toward solving it.

For FleetImporter, that first step was opening the AutoPkg documentation and reading how processors work. For the Mac Admins Slack, it was creating the workspace and inviting the first 20 people.

Pick the smallest possible first step. Do that. Then do the next one.


## Don't wait for permission

Nobody's going to email you and say "you are now authorized to contribute to this community" or "you have been granted permission to build this tool."

You already have permission. You have permission because you noticed the problem. You have permission because you're willing to work on solving it. You have permission because open source and open communities are built by people who just show up and start contributing.

The things you're dealing with right now - the workflow friction, the missing documentation, the tool that doesn't quite exist yet - those are gaps. Someone else is hitting the same problems.

Pick one. Start there. Don't wait for permission.

The time will pass either way. You can spend it waiting for someone to tell you you're ready, or you can spend it doing the things.

Just do the things.
