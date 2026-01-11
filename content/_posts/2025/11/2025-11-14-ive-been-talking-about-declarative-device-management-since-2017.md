---
layout: post
title: "I've been taking about Declarative Device Management since 2017. Most vendors still don't get it."
description: "Vendors sell 'DDM' but still make you click through GUIs. Real declarative management means your git repo IS your device configuration. Here's the difference."
date: 2025-11-14
tags: [fleet, device management]
---

Eight years ago at MacADUK 2017, I gave a talk about something I called "Desired State Management." I won't be linking to that recording - it's from a previous iteration of me that I no longer identify with - but the ideas remain as relevant today as ever. The core concept was simple: define how you want your systems configured, verify they're actually configured that way, and automatically fix them if they're not. No manual checking. No configuration drift. Just automation keeping everything in line.

Fast forward to today, and Apple's given us Declarative Device Management (DDM). Vendors are rushing to implement it, marketing teams are crafting glossy presentations about it, and admins are left wondering if this is actually the revolution we were promised. 

Here's the uncomfortable truth: most of what's being sold as "DDM" today isn't actually declarative device management. It's just DDM profiles - the same old configurations delivered through a new protocol.

## What I meant by Desired State Management

Back in 2017, I outlined three core principles:

1. **Define your desired state** - What should the system look like?
2. **Identify possible states** - What variations might exist in your fleet?
3. **Automate enforcement** - Fix drift without human intervention

The key was making this continuous. Not "set it once and hope," but constant verification and correction. We used smart groups to find non-compliant systems. We set policies to "ongoing" instead of "once per computer." We built extension attributes to detect drift. 

The automation was the point. I literally said on stage: "I really hate having to do things manually. I hate having to make the same decision over and over again." Sound familiar? That's what configuration as code promises - make the decision once, encode it, and let the system enforce it forever.

## The next logical step I couldn't take

The approach in this talk was inspired by some work I had done with Chef for managing our Jamf servers. I immediatly saw the power of being able to define, in code, what I wanted the state of the device to be, and leaving it up to the tooling to figure out the how. What I _really_ wanted was essentially GitOps for endpoint management.

The problem? There was no way to actually implement it with the tools available. Jamf, like every other MDM at the time (and most still today), stored everything in a proprietary database. You could export some things via API, but you couldn't define your entire configuration as code and have the system enforce it.

I was trying to achieve declarative management through imperative tools. Smart groups and ongoing policies were as close as I could get, but I was still clicking through interfaces, still manually creating policies, still hoping someone documented what changed and why.

The logical next step was obvious: get all of this into a git repository where changes are tracked, reviewed, and reversible. Make the repository the source of truth, not just another copy of the truth. But the tooling wasn't there. We were stuck in the GUI, pretending we had automation while still doing everything imperatively.

## DDM profiles vs. actual DDM

When vendors talk about DDM today, they're usually talking about Apple's new profile delivery mechanism. Yes, it's more efficient. Yes, it reduces server load. But fundamentally, you're still clicking through a GUI to create configurations that get pushed to devices. 

That's not declarative management. That's imperative management with better plumbing.

True declarative device management means:

- Your entire configuration lives in version control
- Changes go through code review
- You can diff configurations to see what changed
- Rolling back means reverting a commit
- Your repository IS the state, not a record of it

Think about it: If your MDM server database got corrupted tomorrow, could you rebuild your entire device configuration from a git repository? If not, you're not _really_ doing declarative management.

## The GitOps reality today

At Fleet, we've built what I was trying to describe in 2017. Everything - profiles, scripts, policies, software deployment rules - lives in a git repository. Change a file, commit it, push it, and Fleet enforces it across all of your endpoints. No clicking around in a GUI. No wondering who changed what. No "let me check the audit log."

This isn't a backup of your configuration. This IS your configuration. The repository defines reality, and the system constantly converges toward that definition.

## Breaking the vendor lock-in cycle

Here's the current landscape: as of today, no other endpoint management vendor offers this kind of GitOps workflow. You can export configurations from other MDMs, you can script against their APIs, but you can't define your entire device management strategy in text files and have it just work.

But here's the key difference: Fleet is open source. Having your configurations in git means they're not locked in a vendor's proprietary database. Nothing is stopping anyone from writing a tool to import configurations from a Fleet GitOps repository into another device management vendor. The YAML is readable. The logic is transparent. The configurations are portable text files.

Compare that to traditional MDMs where your configurations are trapped in a black box database. In 2017, I couldn't take my entire Jamf configuration and move it to another MDM without rebuilding everything. Every smart group, every policy, every configuration - all trapped in a database somewhere. Even if you could export everything, you'd need to reverse-engineer the schema, understand the relationships, and build custom tooling for each vendor.

With true declarative management through GitOps:
- Your configurations are portable text files
- Your business logic lives in YOUR repository
- You own your automation, not your vendor
- Migration means translating text, not reverse-engineering databases

The fact that only Fleet offers this today isn't a permanent moat - it's a temporary advantage. As more organizations demand true infrastructure as code for endpoints, other vendors will have to adapt or get left behind. And when they do, your Fleet configurations will be ready to translate.

## Why this matters now

Remember when I talked about smart groups constantly evaluating state? That's table stakes now. Modern osquery-based checks run continuously, not just at inventory time. Changed a file? We know. Uninstalled software? Already fixing it. Modified a setting? Reset before you notice.

The execution frequency debate I mentioned - once per computer vs. ongoing - disappears entirely. In GitOps, everything is always ongoing. The repository defines the state, and the system constantly converges toward it.

That extension attribute I wrote to check and fix a device setting? Today it's a simple query that works identically across macOS, Windows, and Linux. No bash scripts with XML result tags. No platform-specific code. Just universal logic that applies everywhere.

## What about iOS and iPadOS?

Yes, DDM profiles are currently the only option Apple provides for iOS/iPadOS. But even there, the difference between "DDM profiles" and actual DDM matters. Are you clicking through screens to create profiles, or are they defined in code? Can you trace every configuration change through git history? Does your team review profile changes like they review code?

## The path forward

Eight years ago, I was trying to hack declarative management together with tools that were designed to be imperative. I got pretty far, but I was still fighting the tools. Today, the tooling has finally caught up to the vision.

Real DDM isn't about Apple's new profile protocol. It's about treating your device configurations like code. It's about git commits replacing admin console clicks. It's about your repository being the single source of truth, not just another place to store copies.

When I said "make computers do the work for you" in 2017, this is what I meant. Not just automating the enforcement, but automating the entire lifecycle. From configuration to deployment to drift detection to remediation - all defined in text files you can read, review, and reason about.

The vendors selling you "DDM" today are selling you DDM profiles - a new way to deliver the same old configurations. The real revolution is treating infrastructure as code, whether that infrastructure is servers, containers, or the devices your team carries every day.

Stop managing devices. Start declaring their state. There's a difference, and it matters.

---

*Want to see this in action? Our GitOps configuration for Fleet is public: [github.com/fleetdm/fleet/tree/main/it-and-security](https://github.com/fleetdm/fleet/tree/main/it-and-security). Copy it, modify it, make it yours. That's the promise of actual declarative management - and the future other vendors will eventually have to embrace.*
