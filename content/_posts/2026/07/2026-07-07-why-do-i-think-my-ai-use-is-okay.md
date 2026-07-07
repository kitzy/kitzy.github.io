---
layout: post
title: "Why do I think my AI use is okay?"
description: "I use AI every day and I think AI art is bad for the world. Here's my attempt to think through why - honestly."
date: 2026-07-07
tags: [AI, capitalism, values]
---

I use AI nearly every day. I also think AI art is bad for the world.

I know how that sounds.

I use it to write code, to debug infrastructure problems, to help me understand systems I haven't worked in before. I use it to polish blog posts - not to write them, but to help me find where a sentence is clunky or where I've buried the point two paragraphs too deep. I find it genuinely useful in ways I didn't expect when I first started paying attention to it.

And yet when I see AI-generated artwork, something clenches in my chest. When I interact with a customer service chatbot and can't get a human to help me, I feel that particular kind of frustrated that only bad technology produces. I've been vocal about this. I've argued, [on this blog](/blog/what-i-actually-think-about-ai/) and elsewhere, that we should be skeptical of what AI is actually being built for.

So: what's my actual position here?

---

The most principled version of my argument starts with training data.

When companies built the models that generate images and writing, they scraped the internet for work made by human beings - artists, writers, illustrators - without asking. These people didn't consent to having their work used to train a system that would then compete with them for commissions, for jobs, for their ability to make a living doing the thing they spent years learning to do. Sarah Andersen has spent three years in federal court fighting for the right to have that question answered - [a case](https://www.courtlistener.com/docket/66732129/andersen-v-stability-ai-ltd/) that's still grinding through discovery, with no trial date yet set.

You can type a working artist's name into certain image generators and get something that looks remarkably like their style - a style they spent years developing. Artist Kelly McKernan discovered that [the top search result for their own name was an AI-generated image](https://time.com/collections/time100-ai/6309445/kelly-mckernan/) made with Midjourney. The artist sees none of that value and agreed to none of it.

The argument that "it's on the internet, therefore it's fair game" is convenient if you're the one doing the scraping. It's considerably less compelling if you're the one whose style can now be approximated on demand for free.

When AI systems replace human customer service workers, the calculus is similar but the harm is more direct. A company decides it's cheaper to route you through a chatbot than to pay a person to answer your question. The person loses their job. You get a worse experience. The company saves money. I've been stuck in chatbot loops that couldn't understand a basic question - not because the underlying technology was bad, but because nobody optimized it for actually helping me. They optimized it for keeping me away from a human. That's a design choice, not a technical limitation. It tells you something about who the technology is actually for.

That's not innovation. It's extraction.

I think code is different, and I've thought a lot about why I believe that.

Open source software isn't just code that happens to be publicly available. It's a community built on an explicit, principled commitment to sharing. When you release code under a license like MIT or Apache, you're not just making it visible - you're explicitly inviting people to use it, learn from it, build on it, modify it. That's the whole point. The license is the consent.

I've built open source tools. I want people to use these tools. I want people to fork them and improve them and tell me what I got wrong. I engage in community forums and speak at conferences and write this blog specifically because I believe knowledge should be shared freely. The idea that others might learn from my code, including AI systems, doesn't bother me in the way that the idea of AI scraping an artist's entire portfolio does - because I explicitly signed up for the former in a way that artists did not.

---

But consent is only part of the story. The other part is economic.

There's a meaningful difference between AI that functions as a tool and AI that functions as a replacement. When I use AI to debug code, I'm still the one doing the work - understanding the problem, knowing what to ask, evaluating the answer, implementing the fix. The output is worthless without my judgment and expertise. The value flows to me and, downstream, to the people using the tools I build.

When a company replaces a customer service team with a chatbot, the value flows in a completely different direction. The workers are gone. The customer's experience degrades. The savings go to shareholders. A person who had a job and a paycheck and maybe benefits now doesn't. The productivity gain isn't shared - it's captured by those at the top.

This is also true of AI art. When an image generator produces something that approximates an illustrator's style, the company that built the generator captures that value. The artist doesn't. The person commissioning the work pays less. The illustrator loses the commission. From a systems perspective, this isn't complicated: wealth is being transferred from working people to capital, and AI is the mechanism.

I use AI in ways where the value largely flows to me and the people I'm trying to help. The things I object to are AI deployments where the value flows away from workers and toward the companies that replace them. That's not a coincidence. It's also not a complete defense of my position.

---

Nothing was created in a vacuum. This is genuinely, obviously true, and it matters.

Every jazz musician in the twentieth century was building on what came before them. Miles Davis absorbed Charlie Parker and the bebop tradition and came out making something completely different. Coltrane absorbed Miles and made something different still. When you listen to *A Love Supreme*, you can hear the entire history of jazz in it - and you can also hear something that had never existed before. That's how human influence works. You take in everything around you, it changes who you are, and what you make reflects that change.

Literary tradition works the same way. Every noir writer is in conversation with Hammett and Chandler. Every fantasy writer is building on Tolkien, who was building on Norse mythology and Beowulf and everything he'd read and loved. Toni Morrison was in conversation with the entire Western literary tradition, and she remade it. That's not theft. That's culture.

In programming it's even more explicit. Linux was built on the ideas of Unix, which came from Multics. Python was influenced by ABC and C and Haskell. Git built on decades of ideas about version control. Every developer I know has learned by reading other people's code, copying patterns that worked, understanding why they worked, and eventually synthesizing something new from all of it. That's how we all learned. That's how the whole field advances.

If human learning from existing work is legitimate - and I believe it is - then the argument against AI training on creative work can't just be "it was trained on things that already exist." That's true of every human artist who ever lived. The question has to be something more specific.

---

I think the distinction is this: human influence requires transformation. It requires a person.

When a musician spends years absorbing Coltrane, something happens in the space between listening and playing. They internalize the feeling, the theory, the technique, the choices Coltrane made and why. They fail at it for a long time. They figure out their own relationship to it. Eventually they produce something that couldn't have existed without Coltrane but also couldn't exist without them. The influence is real, but so is the transformation.

When a model processes a training corpus and generates a statistically probable next token, that's categorically different - even if the output can look similar from the outside. There's no understanding. There's pattern matching at enormous scale. The model doesn't know what the painting means or why the artist made the choices they did. It knows what pixels tend to appear near other pixels in images tagged with certain words.

I don't think that makes AI-generated creative work evil, exactly. But I do think it matters when we're deciding whether artists owe the process their consent, and whether a system built on their work then displacing them constitutes harm.

---

Not all code in AI training sets was open source. A lot of it was public but unlicensed - which is not the same thing. Unlicensed code is not open source code. MIT-licensed code is not the same as code posted to a forum or a personal site without a license. And even genuinely open source code comes with specific terms that may or may not cover wholesale ingestion for model training. The fact that I'm comfortable with my tools being used as training data doesn't mean everyone who put code on the internet signed up for the same thing. I consented on behalf of my code. I can't consent on behalf of theirs.

The economic argument has the same crack in it. I said the difference is whether value flows to workers or away from them. But plenty of productivity tools have displaced workers throughout history, and I don't object to those categorically. The question of who captures surplus value from new technology is genuinely hard, and I don't have a theory that cleanly vindicates exactly the AI uses I'm comfortable with and indicts exactly the ones I'm not.

---

So where does that leave me?

Probably in the same uncomfortable place it leaves most people who've thought about this carefully: with a position that's principled in some ways and convenient in others.

I am not making my living as an artist or a writer. My job is not at risk from a chatbot. The AI tools I use help me do technical work more effectively and help me find my own words more efficiently. They don't threaten my livelihood. It's easy to feel fine about the AI I use, because the AI I use isn't aimed at replacing me.

If I were an illustrator whose style had been ingested without consent and was now available to anyone for a few tokens, I don't know that I'd draw the same line I do now. If I were a customer service worker who'd been let go because a bot was cheaper, the standing-on-shoulders argument would ring pretty hollow. If I were a working writer watching my market rates collapse because clients could generate a "good enough" draft for free, I'm not sure I'd be writing blog posts about how AI helps me polish my sentences.

I can hold both things at once: that the ways I use AI feel consistent with my values, and that my values also happen to be conveniently compatible with the ways I use AI. Those aren't the same statement, even though they can look identical from the outside.

The most honest thing I can say is this: everyone draws the line just past what they're doing. I am not exempt from this.

The best I can do is keep asking whether my line is principled or just comfortable - and stay honest about the difference.
