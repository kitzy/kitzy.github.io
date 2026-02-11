---
layout: post
title: "It's time to let go of your local admin account"
description: "That shared admin password across your entire Mac fleet? It's not a safety net - it's a liability."
date: 2026-02-11
tags: [mac admin, fleet]
---

Why do so many Mac admin teams still maintain a local administrator account with the same password across their entire fleet?

I'm not asking rhetorically. I genuinely want to know what problem we think we're solving.

Because I suspect if we're honest with ourselves, the answer isn't great.

## Four questions worth asking

Before you close this tab - and I know the reflex is strong - I want you to actually answer these questions. Not defensively, just honestly:

**When was the last time you actually used that local admin account?**

Think about it. Not when you created it. Not when you last verified it exists. When did you last actually log into a device with it because you needed to?

**Do your local admin accounts all share the same static password?**

You know the one. The password that's probably written in a comment in your deployment script. The one that got shared in Slack three years ago. The one that's definitely in a screenshot somewhere.

**When was the last time that password was rotated?**

And by rotated, I mean actually changed, not just "we should probably do that" discussions in quarterly security reviews. How many people who know that password have left your organization since the last time you rotated it?

**What monitoring do you have in place to detect when that account is used?**

Can you tell me right now if someone logged in with it yesterday? Last week? Last month?

I'm going to take a guess at your answers: somewhere between "it's been a while" and "never," yes, not since we set it up in the first place, and none.

If I'm wrong, great. But I've talked to enough teams to know I'm probably not.

## The security theater we tell ourselves

Here's what I think happens: We create these accounts because they feel like a safety net. We tell ourselves we need a "break glass in case of emergency" option. What if MDM fails? What if someone gets locked out? What if we need to get into a device and we can't?

These are legitimate concerns. I'm not dismissing them.

But let's talk about what we've actually created: **a single shared credential that works on every device in your organization.**

Think about that for a second. One password. Hundreds, maybe thousands of devices. And we're keeping that password... where exactly? In a password manager? In documentation? In Slack history? In the heads of everyone who's ever worked in your IT department?

## What could possibly go wrong

Let me walk through some scenarios. Not hypothetical "what if a nation-state actor" scenarios - real, plausible things that happen:

**A contractor leaves.** They helped set up your MDM deployment two years ago. They have the admin password. You don't even remember they know it. They still have it saved in their password manager. They're not malicious - they just never deleted it. But their laptop gets stolen. Or their password manager gets compromised. Or they reuse passwords. Or a hundred other things that happen to real people every day.

**An employee gets phished.** They're running a script from your internal wiki. The script has the admin password hardcoded in it. It's fine, it's only accessible internally. Except the employee's credentials just got phished, and now someone else has access to your internal wiki. They don't need to know which wiki page. They just need to search for "password" or "admin" and there it is.

**You need to investigate something.** There's suspicious activity on a device. You check the logs. You see logins with your shared admin account. Is it legitimate? Is someone on your team troubleshooting? Is it an attacker who found the password? You don't know. You can't know. Because that account is used by everyone on your team, and maybe some people who aren't on your team anymore, and you have no logging or alerting set up to distinguish legitimate use from compromise.

**Someone gets curious.** A user finds the password in a deployment script or a configuration file or a screenshot. They're not malicious. They're just curious what happens if they use it. Now they have admin access to every device in your fleet. You'll never know, because you're not monitoring for it.

**The password is just sitting there.** In GitHub. In an old Jamf policy. In a configuration profile. In documentation that got shared externally by accident. In a support ticket. In a hundred places you've forgotten about because it was set up years ago.

Every single one of these scenarios starts with the same problem: **a shared secret that never changes and exists everywhere.**

## The rotation problem we don't talk about

Here's the thing that really gets me: Even when teams know the password might be compromised - even when someone who knew it leaves the organization - most teams don't rotate it.

Why not? Because rotating it is hard. You have to update your deployment scripts. You have to update your documentation. You have to get it to all the devices somehow. You have to coordinate with your team. You have to hope nothing breaks.

So instead, we just... don't. We add it to the list of things we should do. We mention it in the next security review. We agree it's important. And then we don't do it.

And I get it. I really do. You're busy. You're understaffed. This is one more thing on a list of infinite things. The password has been fine for three years - it'll probably be fine for another three years.

Maybe it will be. But that's not a security strategy. That's hope.

## There's a better way

Here's what kills me about all of this: **We already have a better solution.**

FileVault 2 recovery keys.

If you're escrowing your FV2 recovery keys in your MDM - and you should be - you have exactly what you needed the local admin account for: a way to get into a device when everything else fails.

Except it's better in every meaningful way:

**Each device has a unique key.** A leaked key compromises one device, not your entire fleet.

**The key is only accessible through your MDM.** Which means you have proper access controls, audit logging, and authentication requirements. You know who accessed it and when.

**Some MDMs can automatically rotate the key after it's used.** The key you used yesterday to unlock a device? It's already different today. The attack surface closes behind you.

**You're probably already doing this.** Most orgs are already escrowing FV2 keys. You're just maintaining the local admin account *on top of* that because... why, exactly?

Is it the perfect solution? No. You need your MDM to be working. You need the device to be powered on and able to boot to recovery.

But those same limitations apply to your local admin account too - if the device can't boot, the admin password doesn't help you anyway. And in exchange for those limitations, you get actual security instead of security theater.

## The discomfort of letting go

I know what I'm asking you to give up. That feeling of having a "just in case" option. The comfort of knowing there's a password that will work when you need it. The simplicity of hardcoding a credential and not thinking about it again.

But here's what you're trading for that comfort: **a massive attack surface that you're probably not monitoring, definitely not rotating, and almost certainly can't audit.**

Is it worth it?

I'm not saying you'll definitely get compromised because of your shared admin password. I'm saying the risk-to-benefit ratio is terrible. You're maintaining something that creates significant security exposure to solve a problem you already have a better solution for.

And yeah, removing it requires work. You have to audit your deployment scripts. You have to update your documentation. You have to change your processes. You have to train your team on using FV2 recovery keys instead. None of that is trivial.

But neither is responding to a security incident because someone found your shared admin password.

## What are you waiting for?

So here's my question: What's actually stopping you?

Is it that you don't trust your MDM to be available when you need it? Then the problem is your MDM, not the solution.

Is it that you don't have processes in place for managing FV2 recovery keys? Then build those processes. You should have them anyway.

Is it just inertia? The password has been there so long it feels like infrastructure? Then maybe that's the real problem.

Your shared admin password isn't a feature. It's technical debt that's been there so long you forgot it was debt.

It's time to pay it down.
