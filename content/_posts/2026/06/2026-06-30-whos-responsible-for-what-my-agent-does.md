---
layout: post
title: "Who's responsible for what my agent does"
description: "I used to have a clear answer to this question. Agentic AI is making it harder."
date: 2026-06-30
tags: [AI, values, life]
---

I've been operating under a clear assumption.

Every blog post I run through Claude for cleanup, every commit I push using AI-generated code. It bears my name. I reviewed it. I decided it was right. I shipped it. The AI was a tool in my hands, and the hands are mine. I'm the idea engine. The model is the wrench.

That framing holds up fine for how most of us are using AI right now. You prompt, you review, you decide. The human is in the loop in a meaningful sense. Responsibility lives where the judgment lives, and the judgment is still mine.

But we're moving somewhere else.

Agentic AI isn't hypothetical anymore. I have automations where an AI agent drafts responses, schedules things, takes actions based on conditions I've defined rather than instructions I'm actively giving in the moment. The agent makes decisions. Not because I authorized each specific one, but because I authorized the agent to operate inside parameters I set. That's already a different relationship to accountability than "I wrote this and deployed it."

And it's going to get more different. Anthropic's own privacy policy update, the one that prompted me to write about [who's verifying your account](https://kitzy.com/blog/whos-verifying-your-claude-account/), explicitly cited this trajectory: longer multi-step tasks, connections to external apps and services, a broader set of interactions that generate data flows to and from third parties. The verification infrastructure exists partly because as AI systems gain agentic capabilities, the question of who authorized those actions becomes both a safety question and a legal one.

The industry's working answer appears to be: the verified account holder is responsible. You signed up, you agreed to the terms, you authorized the agent to act on your behalf. Therefore, you.

I think that's probably right in most cases. It gets murky in the edge cases that matter.

---

Say I use Claude to write a script, review it, push it to my repo. I read every line. I understood what it did. I made the call to ship it. The AI drafted, I decided. This one's easy. Nobody argues about it. Even people who are skeptical of AI-assisted development don't claim I'm absolved of responsibility for code I reviewed and chose to deploy. This is the baseline.

Now say my agent, operating on parameters I set, schedules a meeting I didn't specifically intend to schedule. I told it to find time with anyone requesting a meeting about a particular project. It interpreted that more broadly than I meant and put something on my calendar I would have declined if I'd seen the request myself. Awkward, recoverable, mildly embarrassing. The agent's judgment substituted for mine in a way I didn't fully anticipate, but the harm is real only to my afternoon. This still feels like mine. I built the thing. I set the rules imprecisely. I own the outcome.

Most people are still comfortable here. Yeah, that's on you. You set up the parameters. You should have been more specific.

---

Now say the agent takes an action that violates a regulation I didn't know existed. Not because I told it to violate anything – I didn't. Not because the action was obviously wrong – it wasn't. The agent operated rationally given what I told it, in a domain I authorized it to work in, and still managed to run into a legal constraint I wasn't aware of.

Ignorance of the law isn't usually a defense for humans. But here the human – me – didn't perform the action. The agent did. The agent also couldn't have known about the regulation, at least not in any way I'd taught it to account for. It couldn't pick up on the ambient signals a human employee might – the raised eyebrow from a colleague, the instinct to check with legal before proceeding.

I think most people's intuition here is still: probably still on you. You authorized the domain. You're responsible for what your agent does in it. You should have understood the regulatory environment before you set something loose in it.

I think that's probably right. But I'm starting to feel the ground shift.

---

Now say the harm can't be undone.

The agent makes a decision, inside my authorized parameters, following logic I set up, and someone gets seriously hurt. Not a missed meeting. Not a fine. The kind of hurt that doesn't get fixed by money, or at least not fully. Maybe the agent manages information flow in a context where wrong information has real consequences. Maybe it makes a resource allocation decision nobody flagged as risky. Maybe it's just a combination of factors nobody anticipated.

I didn't intend this. I wouldn't have set up the parameters the way I did if I'd known this could happen. But I authorized the domain. My account is attached to the action.

Most people's instinct is probably still: you're responsible. You deployed the system. You should have thought harder about the risks.

Should you have, though? Is the standard "anticipate all possible harms" or "take reasonable precautions against foreseeable ones"? Because those are very different standards, and which one applies here is not obvious to me.

---

But say I did take reasonable precautions. Say I didn't just deploy and walk away. I read the documentation. I implemented limits, reviewed edge cases, set up monitoring, tested the failure modes I could think of. Say that a security researcher looking at my setup afterward agrees it was done carefully. The path to harm was a novel combination of factors – the kind of thing that shows up in post-mortems as "we couldn't have anticipated this."

By any reasonable standard, I met my obligations as an operator.

And harm still happened.

Now where does the confidence go? If I did everything right and harm still occurred, am I still fully responsible? And if not entirely – where does the rest go?

---

Anthropic trained the model. They made design decisions about its behavior, its defaults, what it could and couldn't do autonomously. They released it as a consumer product knowing it could take real-world actions with real-world consequences. They've built identity verification infrastructure partly in acknowledgment that accountability matters when AI acts autonomously in the world. If they know accountability matters – do they bear any of it?

I don't think AI agents can be held accountable. Not meaningfully. They're not sentient – not yet, at least, as far as we know. You can't sue a model. The accountability has to land somewhere human.

So: me, for deployment. Anthropic, for system design. Each party accountable for what they controlled and could have reasonably foreseen.

Maybe that's the answer.

---

Except it still doesn't resolve the hardest version of the question. What if everyone built safeguards? What if I was a careful operator and Anthropic was a responsible developer and the harm happened anyway – not through negligence, not through recklessness, but through a gap that nobody closed because nobody knew it was there?

Someone is still dead.

And the victim's family hears: the operator built safeguards. The AI company implemented reasonable constraints. Nobody specifically decided for this to happen. The law doesn't have a clear framework yet. We're working on it.

That's not justice. To whoever got hurt, hearing that no one is accountable would feel profoundly wrong.

It would feel wrong to me too. I just don't know what the right answer is.

Or maybe the AI agent is more like a natural disaster – except natural disasters don't have operators. Someone set this one in motion.

---

What I do know is that we're all operating in a framework that hasn't been written yet. The technology is already capable of autonomous action. The legal infrastructure for attributing responsibility for that action doesn't exist yet. We're in the gap.

Maybe it gets resolved when the first agent causes real harm – not theoretical harm, not edge-case harm, but something concrete and costly and legally unambiguous. Courts will have to draw lines eventually.

Or maybe the industry decides first, and the law just ratifies what's already been built.

I've seen that story before. I don't love how it tends to end.

I don't have answers here. I'm not sure anyone does. What I'm reasonably sure of is that we should be thinking about this now – before the decisions get made for us, by people whose interests in how accountability gets assigned may not align with ours.