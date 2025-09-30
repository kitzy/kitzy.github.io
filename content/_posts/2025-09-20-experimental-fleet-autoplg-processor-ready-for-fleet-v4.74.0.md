---
layout: post
title: "My experimental Fleet AutoPkg processor is ready for Fleet v4.74.0 gitops YAML changes"
description: "Fleet v4.74.0 will introduce breaking changes to gitops YAML. My experimental Fleet autopkg processor is already updated to handle the new schema, automatically detecting your server version via the Fleet API and outputting the correct format, no recipe changes needed."
date: 2025-09-20
tags: [fleet, autopkg, projects, experiments]
---

Breaking changes aren’t fun, but sometimes they’re necessary. Fleet v4.74.0 will change how `gitops` YAML is structured, so anything that writes those files will need to adapt.

I’ve been tinkering with an [experimental Fleet autopkg processor](https://github.com/kitzy/fleet-autopkg-recipes) that ties [autopkg](https://github.com/autopkg/autopkg) into Fleet. I’ve already updated the processor so it understands the new schema that’s coming in Fleet v4.74.0.  

It’s still experimental and not in active use anywhere (as far as I know), but it’s now in a good place if you want to kick the tires — and it’s ready ahead of the breaking changes in Fleet.

## What’s changing in Fleet

Starting in Fleet v4.74.0, `gitops` YAML will move to a new format. That could break tools that assume the old structure.

Here’s the important part for this project: **existing autopkg recipes will not need to change.** The processor is the piece that adapts, not the recipes. If you were hand-rolling YAML elsewhere, that code would need attention, but the recipes here can stay as they are. Details are in the [issue thread](https://github.com/kitzy/fleet-autopkg-recipes/issues/13).

## How the processor now works

The export step writes YAML that matches the server’s expected schema. Instead of a static switch, the processor figures out what to emit.

- **Recipes stay the same.** The processor takes their outputs and writes the right YAML shape.  
- **Version detection built in.** It queries the Fleet API to learn the server version, then chooses the correct YAML format.  
- **New schema supported.** When the server is v4.74.0 or later, it emits the new `gitops` YAML.  
- **Backwards compatibility.** When the server is older than v4.74.0, it emits the legacy format.  
- **Modular exporter.** If the schema changes again, it should be straightforward to extend.  

For more information, please see the [implementation summary](https://github.com/kitzy/fleet-autopkg-recipes/issues/13#issuecomment-3315146644).

## Why this matters (even for an experiment)

The goal is to cut manual toil from keeping software definitions up to date. Schema shifts threaten to snap that automation.

By automatically querying the Fleet API and writing the right YAML for the server you’re targeting, the processor quietly does the right thing. That means fewer surprises when Fleet upgrades land and less fiddling to keep workflows moving.

Even if this isn’t running in production anywhere, it’s a working reference — and maybe a starting point — for folks exploring the same idea.

## What’s next

I’ll keep iterating as Fleet evolves. If you’re curious, track progress or experiment in the [fleet-autopkg-recipes repo](https://github.com/kitzy/fleet-autopkg-recipes).
