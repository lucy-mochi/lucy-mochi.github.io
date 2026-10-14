// Edit this file to update the site. No other code changes needed.

const SITE = {
  // Your GitHub profile. Used for every github link on the site.
  github: "https://github.com/lucy-mochi",

  // Paste projects here. Add as many as you like.
  // `links` are shown on the project's own page (repo, demo, paper). `image` is optional.
  projects: [
    {
      title: "Stable",
      year: "Personal project",
      description: "Insurance contract management software for small medical clinics: storage, organization, and insights for their payer contracts.",
      tags: ["Software"],
      links: [
        { label: "Visit the website", url: "https://lucy-mochi.github.io/stable-app/" },
        { label: "GitHub", url: "https://github.com/lucy-mochi/stable-app" }
      ],
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "Senior thesis",
      year: "Philosophy",
      description: "Applied Bayesian belief-updating models to Hume's Of Miracles, analyzing how probabilistic frameworks handle testimonial evidence, outlier events, and rational belief under uncertainty.",
      tags: ["Bayesian", "Philosophy"],
      links: [{ label: "Read the paper", url: "assets/papers/Hume_miracles.pdf" }],
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "Epistemic utility and horse race betting",
      year: "Graduate decision theory seminar",
      description: "Computationally modeled Isaac Levi's epistemic utility framework applied to horse race betting, simulating 10,000-trial scenarios to find optimal specificity-versus-error tradeoffs under varying information asymmetry.",
      tags: ["Decision theory", "Simulation"],
      links: [{ label: "Read the paper", url: "assets/papers/Levi_horse_racing.pdf" }],
      reference: "Based on Isaac Levi, Gambling with Truth: An Essay on Induction and the Aims of Science (1967).",
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "Sentiment analysis of philosophical texts",
      year: "Statistics & machine learning",
      description: "Fine-tuned a BERT model to perform sentiment analysis on 14,000+ excerpts from 45 philosophical works across cultures and time periods, revealing patterns and the limits of sentiment models on nuanced text.",
      tags: ["BERT", "NLP"],
      links: [],
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "Poincaré and Hempel on mathematical induction",
      year: "Philosophy of mathematics · February 2025",
      description: "Poincaré cites the principle of mathematical induction, which he also calls proof by recurrence, as the element in mathematical reasoning that goes beyond mere logical deduction and raises mathematics to the level of a science. How would Hempel disagree? Would his reasons for disagreement be good ones?",
      tags: ["Philosophy of mathematics"],
      links: [{ label: "Read the essay", url: "assets/papers/philosophy/poincare-hempel-induction.pdf" }],
      references: [
        { label: "Poincaré, “On the Nature of Mathematical Reasoning,” in Science and Hypothesis (1905)", url: "https://archive.org/download/sciencehypothesi00poin/sciencehypothesi00poin_bw.pdf" },
        { label: "Hempel, “On the Nature of Mathematical Truth” (1945)", url: "https://doi.org/10.2307/2306103" }
      ],
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "The moral of Achilles and the Tortoise",
      year: "Philosophy of mathematics · April 2025",
      description: "What is really the moral of Lewis Carroll's bit about Achilles and the Tortoise?",
      tags: ["Philosophy of mathematics", "Logic"],
      links: [{ label: "Read the essay", url: "assets/papers/philosophy/achilles-and-the-tortoise.pdf" }],
      references: [
        { label: "Carroll, “What the Tortoise Said to Achilles,” Mind (1895)", url: "assets/papers/philosophy/carroll-what-the-tortoise-said-to-achilles.pdf" }
      ],
      image: ""
    },
    {
      group: "Philosophy Writing and Research",
      title: "Benacerraf on what numbers could not be",
      year: "Philosophy of mathematics · May 2025",
      description: "Benacerraf's paper “What Numbers Could Not Be” ends with this paradoxical sounding passage: “[T]here are no such things as numbers; which is not to say that there are not at least two prime numbers between 15 and 20.” What did the author mean?",
      tags: ["Philosophy of mathematics", "Structuralism"],
      links: [{ label: "Read the essay", url: "assets/papers/philosophy/benacerraf-what-numbers-could-not-be.pdf" }],
      references: [
        { label: "Benacerraf, “What Numbers Could Not Be,” The Philosophical Review (1965)", url: "https://doi.org/10.2307/2183530" }
      ],
      image: ""
    }
  ],

  // Design imagery (your film scans used as part of the site itself).
  // Both are optional; missing files are skipped.
  backdrop: "assets/design/backdrop.jpg",   // full-page glowing wash behind everything
  heroImage: "assets/design/hero.jpg",      // fills the glowing orb on the home tab

  // Art tab. Each key is a sub-tab. A sub-tab is either a list of image paths,
  // or groups of them ({ groupName: [paths] }), shown under small headings.
  // Paths are relative to assets/art/. Empty sub-tabs are hidden.
  art: {
    "Film Scans": {
      "Color": [
        "film-scans/color/hotel-window.jpg",
        "film-scans/color/dunes.jpg",
        "film-scans/color/desk.jpg",
        "film-scans/color/rooftops.jpg",
        "film-scans/color/street-dusk.jpg"
      ],
      "Black & White": [
        "film-scans/black-and-white/calla-1.jpg",
        "film-scans/black-and-white/calla-2.jpg",
        "film-scans/black-and-white/calla-3.jpg"
      ]
    }
  }
};
