---
title: "Postmark"
description: "An open wiki and indexing tool for books and printed works meant to engage users in identifying their interests and speedrunning their reading list."
date: "Oct 2024"
demoURL: ""
repoURL: "https://github.com/enkyuan/postmark"
---

## Overview

It's a very simple content indexing system that's designed to help users read through books faster. So far I'm thinking for it to a crowdsourced tool that draws discussions on books available from the OpenLibrary API and aggregates them into a single location to help people decide what they want to read next based on some basic context. 

A friend of mine suggested that I should index each book to extract the most important snippets ("important" being loosely defined here) so that for books that have been read, it's easier to recall concepts and ideas relevent to the central point of the book. Nothing too crazy. I intend to build this with Vue, AdonisJS, NHost, Tailwind, PandaCSS, and a few open-source libraries for searching, filtering, etc. Be sure to check out the repo (not much activity yet) for more details.

## Quick Update ~ 16 Nov

So far I've set up most of the frontend with React (and Vite) with Shadcn running under the hood for my components. Routing is handled by React Router (obviously) with state management done by Zustand. I need to get E2E testing set up using Vitest and then I can start working on the backend. I'm thinking of using TS Express for the backend mingled in with a Postgres instance hosted on Xata with queries handled by Drizzle. There's still a few more pages I need to design and implement, but what's already there should stay. Better Auth is being a pain to use right now and TS annotations with Express doesn't make it any better--I might need to consider using JWT instead. Looking forward to posting the next update sometime in December.
