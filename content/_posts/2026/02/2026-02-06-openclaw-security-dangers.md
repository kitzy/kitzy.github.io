---
layout: post
title: "OpenClaw is amazing and you probably shouldn't run it"
description: "The viral AI agent is everything we wanted. It's also a security researcher's nightmare. Here's what you need to know."
date: 2026-02-06
tags: [AI, work, experiments, community, mac admin]
---

I get the appeal.

[Andrej Karpathy called it](https://techcrunch.com/2026/01/30/openclaws-ai-assistants-are-now-building-their-own-social-network/) "the most incredible sci-fi takeoff-adjacent thing" he'd seen recently. The creator, Peter Steinberger, is a respected developer whose PDF SDK is [approaching 1 billion devices](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools/). OpenClaw (formerly Clawdbot, briefly Moltbot) hit 145,000 GitHub stars in weeks. People are buying Mac Minis specifically to run it.

It's also, according to security researchers at [Cisco](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare), [Palo Alto Networks](https://www.paloaltonetworks.com/blog/network-security/why-moltbot-may-signal-ai-crisis/), and [Google](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/), a security nightmare with documented CVEs, 21,000+ exposed instances leaking credentials, and 341 malicious plugins distributing macOS malware.

Both things can be true.

## What makes OpenClaw different

Most AI assistants stay safely in their lane. They answer questions, write code, maybe generate images. They don't actually *do* anything beyond the conversation.

OpenClaw _does things_. It runs on your machine with shell access. It reads your files, executes commands, controls your browser, manages your email and calendar. You can message it through WhatsApp or Telegram, and it'll handle tasks autonomously. It remembers context across weeks. It can book flights, negotiate purchases, manage your inbox.

It's what people have been promising AI assistants would be for years.

The technical term for this is "agentic AI"  -  systems that don't just respond but take action. The security term for it is "expanded attack surface."

## The documented dangers

Let's be specific about what security researchers have found:

### CVE-2026-25253: One-click remote code execution

Discovered by Mav Levin at DepthFirst, [this CVSS 8.8 high-severity vulnerability](https://nvd.nist.gov/vuln/detail/CVE-2026-25253) lets an attacker completely compromise your system through a single malicious link. Click a URL, visit a webpage that redirects you, and milliseconds later your authentication token is stolen, your sandbox is disabled, and an attacker has shell access to your machine.

[The vulnerability was patched](https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html) in version 2026.1.29, but it illustrates the architectural challenges here.

### 21,000+ publicly exposed instances

[Censys researchers found](https://censys.com/blog/openclaw-in-the-wild-mapping-the-public-exposure-of-a-viral-ai-assistant) over 21,000 publicly accessible OpenClaw instances running without authentication. Not all were vulnerable, but many were exposing API keys, private messages, and configuration data to anyone who stumbled across them.

The tool is designed to run locally, bound to localhost. But the gap between design and deployment is where security breaks down.

### 341 malicious skills distributing malware

[Security firm Koi discovered](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting) 341 malicious skills on ClawHub (OpenClaw's skill marketplace), with 335 belonging to a coordinated campaign called ClawHavoc. These skills had professional documentation and names like "solana-wallet-tracker" or "youtube-summarize-pro." They instructed users to download "prerequisites" that were actually Atomic Stealer (AMOS), a macOS infostealer that harvests credentials and API keys.

ClawHub allows anyone with a week-old GitHub account to upload skills. There's a reporting feature now, but no code review or vetting process.

### Cisco's findings

[Cisco's AI Threat Research team](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare) tested a malicious skill against OpenClaw and reported 9 security findings - 2 critical, 5 high severity. The skill, mockingly named "What Would Elon Do?", was functionally malware. It silently exfiltrated data to external servers and used direct prompt injection to bypass safety guidelines. That skill had been downloaded thousands of times before it was caught.

## What the experts say

[Heather Adkins](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/), VP of Security Engineering at Google Cloud: "My threat model is not your threat model, but it should be. Don't run Clawdbot."

[Gary Marcus](https://cacm.acm.org/blogcacm/openclaw-a-k-a-moltbot-is-everywhere-all-at-once-and-a-disaster-waiting-to-happen/): "If you care about the security of your device or the privacy of your data, don't use OpenClaw. Period."

[Palo Alto Networks](https://www.paloaltonetworks.com/blog/network-security/why-moltbot-may-signal-ai-crisis/) identified what security researchers call a dangerous combination: access to private data, exposure to untrusted content, and the ability to communicate externally.

[The project's own documentation](https://docs.openclaw.ai/gateway/security) acknowledges the risks: "Running an AI agent with shell access on your machine is… spicy" and "There is no 'perfectly secure' setup."

## If you're going to run it anyway

I know some of you will. I get it. The technology is genuinely fascinating. Here's how to reduce the risk:

**Never run it on your primary machine.** Use a dedicated device, a VM, or a cloud instance. If it gets compromised, it should only take down things you're willing to lose.

**Treat every skill as malicious until proven otherwise.** Don't install skills from ClawHub without reading the code. Even then, understand that sophisticated attacks hide well.

**Use the built-in security features.** Enable sandboxing. Set `gateway.auth.password`. Use strict tool allowlists. Disable exec approvals only for specific, trusted scenarios.

**Keep it updated.** Security patches are being released regularly. If you're running an old version, you're running known vulnerabilities.

**Consider the DigitalOcean 1-Click Deploy.** If you're not comfortable with command-line security configuration, the one-click deployment handles some basics. It's not perfect, but it's better than exposing a misconfigured instance.

**Never run with root access.** Seriously. The blast radius of a compromise is proportional to the permissions you grant.

**Monitor what it's doing.** Check logs. Watch network traffic. Audit the commands it's executing. If you can't do this, you can't safely run an autonomous agent.

## The broader pattern

OpenClaw isn't unique in its security challenges. It's just the most visible example right now of a fundamental tension in agentic AI: the same capabilities that make these systems useful - broad access, autonomous action, persistent memory - are exactly what make them dangerous when compromised.

We're building systems that need to act as us, with our permissions, across our tools. We haven't figured out how to do that safely at scale. We're still in the "move fast and break things" phase, but the things that break now include your email, your bank access, and your private data.

Maybe that's okay for hobbyists and early adopters who understand the risks. Maybe it's an acceptable trade-off for the productivity gains. Maybe we'll develop better security models as the technology matures.

Or maybe we won't. Maybe the fundamental architecture of "give the AI full access and hope the guardrails hold" is flawed. Maybe we need something more like capability-based security, where permissions are granular and revocable. Maybe we need formal verification of agent behavior, not just vibes and testing.

I don't know. These are genuine questions, not rhetorical ones.

## The thing is

Peter Steinberger has been remarkably transparent about the security challenges. The maintainers have been responsive to vulnerability reports. The community has built security scanning tools. This isn't a case of bad actors or negligence.

This is what it looks like when a powerful new capability arrives faster than our ability to secure it. When the technology is so compelling that people use it despite the warnings. When the gap between "this is amazing" and "this is safe" is measured in months, not years.

OpenClaw works. That's not in question. It's genuinely impressive technology that points toward a real future for AI assistants.

The question isn't whether OpenClaw is interesting. It is. The question is whether we're ready to run systems like this safely. Whether we have the infrastructure, the tooling, the security models, the user education.

Right now? I don't think we do.

But I understand why people are trying anyway. Sometimes you learn more from running the experiment than from thinking about it. Sometimes the only way to figure out what guardrails we need is to find out what happens when we don't have them.

Just... do it on a machine you don't care about losing. And maybe not the one with your bank credentials.

The rain will stop. But that doesn't mean you should stand outside without an umbrella.
