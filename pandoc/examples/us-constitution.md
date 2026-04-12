---
title: The United States Constitution
subtitle: A reader's edition with marginalia
author: Marginalia Pandoc Demo
date: Ratified June 21, 1788
---

A curated reader's edition showcasing marginalia's typographic affordances —
dropcaps, pull quotes, callouts in four colors, sidebars, margin notes,
badges, inline highlights, and footnote popovers — applied to the founding
document of the United States. Source text is verbatim from the
[National Archives transcript](https://www.archives.gov/founding-docs/constitution-transcript).

{Ratified 1788} {27 amendments: tip} {~4,500 original words}

Every visual affordance on this page was generated from plain markdown by
running `pandoc` with the marginalia Lua filter. No Photoshop. No handcrafted
HTML. The source file is three hundred lines and change; the rendered page
is the one you're reading.

---

## Preamble

{dropcap}
We the People of the United States, in Order to form a more perfect Union,
establish Justice, insure domestic Tranquility, provide for the common
defence, promote the general Welfare, and secure the Blessings of Liberty
to ourselves and our Posterity, do ordain and establish this Constitution
for the United States of America.

> [!ASIDE]
> The Preamble is a single sentence — fifty-two words long. It states the
> document's purpose but grants no powers of its own; the Supreme Court has
> held it is not itself a source of federal authority (*Jacobson v.
> Massachusetts*, 197 U.S. 11, 1905).

==We the People== is the rhetorical hinge: sovereignty is declared to rest
in the People, not the States. That framing would be litigated, fought
over, and tested repeatedly in the two and a half centuries that followed.

---

## Article I — The Legislative Power

> [!NOTE]
> Article I is the longest article in the Constitution, comprising roughly
> half the original text. Its length reflects the Framers' belief that
> Congress would be the most powerful branch — and the one most in need of
> enumerated limits.

### Section 1 — Legislative Vesting Clause

::: const
All legislative Powers herein granted shall be vested in a Congress of the
United States, which shall consist of a Senate and House of Representatives.
:::

The phrase ==herein granted== is load-bearing. Congress holds only enumerated
powers, not a general legislative authority[^enum]. Everything not granted is
withheld — at least in theory.

[^enum]: This is the core doctrine of **enumerated powers**, repeatedly
    invoked from *McCulloch v. Maryland* (1819) through *United States v.
    Lopez* (1995). The modern practical scope of the doctrine remains deeply
    contested.

### Section 8 — The Enumerated Powers {selection: important}

Section 8 is the famous catalog of what Congress may do. Three clauses have
proven especially consequential.

**Clause 1 — Taxing and Spending Power**

::: const
The Congress shall have Power To lay and collect Taxes, Duties, Imposts and
Excises, to pay the Debts and provide for the common Defence and general
Welfare of the United States; but all Duties, Imposts and Excises shall be
uniform throughout the United States.
:::

> [!TIP]
> The "general Welfare" language looks unlimited but was held in *United
> States v. Butler* (1936) to be constrained to spending that furthers
> enumerated ends. It remains one of the most litigated phrases in American
> constitutional law.

**Clause 3 — Commerce Clause**

::: const
To regulate Commerce with foreign Nations, and among the several States,
and with the Indian Tribes;
:::

> [!IMPORTANT]
> The Commerce Clause is the single most expansively interpreted phrase in
> the Constitution. Its reach grew dramatically in *Wickard v. Filburn*
> (1942), contracted in *United States v. Lopez* (1995), and became the
> constitutional basis for civil-rights enforcement (*Heart of Atlanta
> Motel v. United States*, 1964). Most modern federal regulation traces
> its authority here.

**Clause 18 — Necessary and Proper Clause**

::: const
To make all Laws which shall be necessary and proper for carrying into
Execution the foregoing Powers, and all other Powers vested by this
Constitution in the Government of the United States, or in any Department
or Officer thereof.
:::

> [!MARGIN]
> Also called the *Elastic Clause*. First expansively read by Chief Justice
> John Marshall in *McCulloch v. Maryland* (1819).

---

## Article II — The Executive Power

::: const
The executive Power shall be vested in a President of the United States of
America. He shall hold his Office during the Term of four Years...
:::

One sentence vesting the entire executive branch in a single individual.
Every separation-of-powers dispute in American history descends from the
question of what that sentence means.

---

## Article III — The Judicial Power

::: const
The judicial Power of the United States, shall be vested in one supreme
Court, and in such inferior Courts as the Congress may from time to time
ordain and establish.
:::

> [!ASIDE]
> Article III is strikingly thin: it establishes the Supreme Court, leaves
> the inferior federal courts to Congress, defines treason, and does little
> else. Judicial review — the power to strike down legislation — is nowhere
> mentioned. The Court claimed it for itself in *Marbury v. Madison* (1803),
> and the rest of American constitutional law unfolds from that claim.

---

## The Bill of Rights {Ratified 1791: tip}

The first ten amendments were ratified as a bloc on December 15, 1791,
barely two years after the Constitution itself took effect. Their purpose
was political: to forestall anti-Federalist opposition by binding the new
federal government to explicit limits. The five reproduced here are the
most cited.

### First Amendment

::: const
Congress shall make no law respecting an establishment of religion, or
prohibiting the free exercise thereof; or abridging the freedom of speech,
or of the press; or the right of the people peaceably to assemble, and to
petition the Government for a redress of grievances.
:::

> [!QUOTE]
> Congress shall make no law...

Five distinct rights in forty-five words: ==religious establishment==,
==free exercise==, ==speech==, ==press==, and ==assembly== (plus petition,
depending on how you count).

### Second Amendment

::: const
A well regulated Militia, being necessary to the security of a free State,
the right of the people to keep and bear Arms, shall not be infringed.
:::

> [!IMPORTANT]
> The scope of the individual right was not definitively resolved by the
> Supreme Court until *District of Columbia v. Heller* (2008) — more than
> two centuries after ratification. Earlier cases treated the right as
> militia-linked. Few constitutional provisions have been as politically
> charged or as interpretively unstable.

### Fourth Amendment

::: const
The right of the people to be secure in their persons, houses, papers, and
effects, against unreasonable searches and seizures, shall not be violated,
and no Warrants shall issue, but upon probable cause, supported by Oath or
affirmation, and particularly describing the place to be searched, and the
persons or things to be seized.
:::

> [!MARGIN]
> The modern exclusionary rule — evidence from unreasonable searches is
> suppressed at trial — was federalized in *Weeks v. United States* (1914)
> and extended to the states in *Mapp v. Ohio* (1961).

### Fifth Amendment {due process: note}

::: const
No person shall be held to answer for a capital, or otherwise infamous
crime, unless on a presentment or indictment of a Grand Jury, except in
cases arising in the land or naval forces, or in the Militia, when in
actual service in time of War or public danger; nor shall any person be
subject for the same offence to be twice put in jeopardy of life or limb;
nor shall be compelled in any criminal case to be a witness against
himself, nor be deprived of life, liberty, or property, without due
process of law; nor shall private property be taken for public use,
without just compensation.
:::

The Fifth Amendment bundles five distinct protections: ==grand jury
indictment==, ==double jeopardy==, ==self-incrimination==, ==due process==,
and ==takings with just compensation==. Each has generated its own body of
Supreme Court doctrine the size of a small library.

### Eighth Amendment

::: const
Excessive bail shall not be required, nor excessive fines imposed, nor
cruel and unusual punishments inflicted.
:::

Twenty-one words. Every phrase has been the subject of extensive modern
litigation — the meaning of "excessive", the scope of "unusual", and the
evolving standards against which cruelty is measured.

---

## A Constitutional Arc in Three Amendments

Three amendments, ratified within fourteen years, tell the story of the
most dramatic reversal in American constitutional history — the rise and
fall of Prohibition.

### Amendment XVIII — Prohibition {Ratified 1919: warning}

::: const
After one year from the ratification of this article the manufacture,
sale, or transportation of intoxicating liquors within, the importation
thereof into, or the exportation thereof from the United States and all
territory subject to the jurisdiction thereof for beverage purposes is
hereby prohibited.
:::

> [!WARNING]
> The only constitutional amendment ever to restrict a behavior rather
> than grant or protect a right. A failed experiment, repealed within
> fourteen years.

> [!MARGIN]
> Ratified January 16, 1919.

### Amendment XIX — Women's Suffrage {Ratified 1920: tip}

::: const
The right of citizens of the United States to vote shall not be denied or
abridged by the United States or by any State on account of sex.
:::

> [!NOTE]
> Ratified August 18, 1920 — seventy-two years after the Seneca Falls
> Convention of 1848 first demanded women's suffrage as a federal right.
> One sentence, twenty-eight words, generations of activism.

### Amendment XXI — Repeal {Ratified 1933: important}

::: const
The eighteenth article of amendment to the Constitution of the United
States is hereby repealed.
:::

> [!IMPORTANT]
> Sixteen words that undid fourteen years of Prohibition. The Twenty-first
> is the only amendment to explicitly repeal another, and the only one
> ratified by state conventions rather than state legislatures.

> [!ASIDE]
> The Prohibition arc is instructive for anyone who assumes the
> Constitution is static. In fourteen years the country added, enforced,
> and completely reversed a major amendment — faster than most
> contemporary legislation can pass through a single Congress.
> Constitutional change is slow in theory and, occasionally, astonishingly
> fast in practice.

---

## About this edition

This page exists to demonstrate the [marginalia](https://github.com/andyed/marginalia)
CSS library and its [pandoc filter](../README.md). Every component you
have seen — the dropcap at the Preamble, the four-color callouts, the
sidebars, the margin notes, the pull quote, the inline highlights, the
badges, and the footnote popover — was generated from plain markdown by
running:

```bash
pandoc us-constitution.md \
  --from markdown+mark+alerts \
  --lua-filter ../marginalia.lua \
  --template template-local.html \
  --standalone \
  -o us-constitution.html
```

Source text: [National Archives Founding Documents](https://www.archives.gov/founding-docs).
Marginalia: [github.com/andyed/marginalia](https://github.com/andyed/marginalia).
