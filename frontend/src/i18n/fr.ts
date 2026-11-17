// Dictionnaire français, servi sous /fr/. Typé sur `en.ts` : toute clé
// manquante ou en trop est signalée par TypeScript.
import type { Dictionary } from "./en";

const fr: Dictionary = {
  meta: {
    siteName: "Zoléni Kokolo Zassi",
    home: {
      title: "Zoléni Kokolo Zassi — Python, Data & Infrastructure Linux",
      description:
        "Développeur Python et étudiant en M1 MIAGE SBI à l'Université Paris 1 Panthéon-Sorbonne, orienté data science et infrastructure Linux. Portfolio et blog.",
    },
    about: {
      title: "À propos de Zoléni Kokolo Zassi — Paris 1 Panthéon-Sorbonne",
      description:
        "Qui est Zoléni Kokolo Zassi ? Développeur Python et étudiant en M1 MIAGE SBI à l'Université Paris 1 Panthéon-Sorbonne — parcours, centres d'intérêt et langues.",
    },
    skills: {
      title: "Compétences & expertise — Zoléni Kokolo Zassi",
      description:
        "Vue d'ensemble des compétences techniques de Zoléni Kokolo Zassi — langages de programmation, data science, DevOps et outils de développement.",
    },
    experience: {
      title: "Expérience & formation — Zoléni Kokolo Zassi",
      description:
        "Parcours professionnel et formation de Zoléni Kokolo Zassi — développeur Python, ingénieur infrastructure et étudiant à Paris 1 Panthéon-Sorbonne.",
    },
    projects: {
      title: "Projets — Zoléni Kokolo Zassi",
      description:
        "Une sélection de projets qui illustrent les compétences de Zoléni Kokolo Zassi en développement logiciel, data science et innovation numérique.",
    },
    blog: {
      title: "Blog — Zoléni Kokolo Zassi",
      description:
        "Journal d'apprentissage : mes notes et synthèses sur la 3D, le développement et l'infrastructure.",
    },
    contact: {
      title: "Contact — Zoléni Kokolo Zassi",
      description:
        "Contactez Zoléni Kokolo Zassi — ouvert aux opportunités, aux collaborations et aux discussions.",
    },
    notFound: {
      title: "404 — Page introuvable | Zoléni Kokolo Zassi",
      description:
        "Cette page n'existe pas. Retournez à l'accueil du portfolio de Zoléni Kokolo Zassi.",
    },
    ogImageAlt:
      "Zoléni Kokolo Zassi — Développeur Python, Data Science, Infrastructure Linux",
  },

  person: {
    jobTitle: "Développeur Python & Développeur Full Stack junior",
    description:
      "Développeur Python et étudiant en M1 MIAGE SBI à l'Université Paris 1 Panthéon-Sorbonne, orienté data science et infrastructure Linux.",
  },

  nav: {
    about: "À propos",
    skills: "Compétences",
    experience: "Expérience",
    projects: "Projets",
    blog: "Blog",
    contact: "Contact",
    github: "GitHub",
    downloadCv: "Télécharger le CV",
    toggleMenu: "Afficher ou masquer la navigation",
    language: "Langue",
  },

  common: {
    available: "Disponible pour de nouvelles opportunités",
    location: "Chauconin-Neufmontiers, France",
    viewCode: "Voir le code",
    backToTop: "Retour en haut",
  },

  trusted: {
    headingBefore: "Ils m'ont",
    headingAccent: "fait confiance",
    ariaLabel: "Entreprises avec lesquelles j'ai travaillé",
  },

  hero: {
    badge: "Bienvenue sur mon portfolio",
    title: "Bonjour, je suis Zoléni Kokolo Zassi",
    leadBefore: "",
    leadRole: "Développeur Python & Développeur Full Stack junior",
    leadAfter:
      " passionné par l'automatisation, la migration d'infrastructures (Docker/LXC) et la création de solutions logicielles concrètes, de bout en bout. Je suis animé par la curiosité, la créativité et l'envie de résoudre de vrais problèmes.",
    seeWork: "Voir mes projets",
    getInTouch: "Me contacter",
    photoAlt: "Zoléni Kokolo Zassi",
  },

  about: {
    title: "Mon parcours jusqu'ici",
    p1Before: "Je prépare actuellement un ",
    p1Highlight: "M1 Master MIAGE SBI à l'Université Paris 1 Panthéon-Sorbonne",
    p1After:
      ", après un Bachelor Human-IT à l'ENSEA Cergy, centré sur les technologies de l'information et leur impact sur la société. Mes expériences vont de la migration d'infrastructure (de Docker vers LXC/Waydroid) à l'automatisation en Python/Bash, en passant par le développement full stack.",
    quote:
      "« Animé par la curiosité, attaché à la qualité, inspiré par la technologie. »",
    p2: "Ma passion, c'est l'automatisation et la création de solutions concrètes de bout en bout — du déploiement de serveurs Linux aux applications web full stack. J'aime transformer des défis d'infrastructure et de logiciel complexes en systèmes propres et fiables.",
    learnMore: "En savoir plus sur moi et mes centres d'intérêt",
    pageTitle: "À propos de Zoléni Kokolo Zassi",
    pageIntro:
      "Un regard plus proche sur qui je suis, ce qui compte pour moi et ce qui me passionne en dehors du code.",
    // Contenu propre à la page /about/ (l'accueil garde p1/quote/p2 ci-dessus).
    page: {
      intro: [
        "Salut, moi c'est Zoléni. Je viens de Meaux, en Île-de-France, et mon parcours est tout sauf linéaire.",
        "Je suis aujourd'hui en M1 MIAGE SBI à l'Université Paris 1 Panthéon-Sorbonne, en alternance chez NOXIA Security, après un Bachelor Human-IT à l'ENSEA. J'y ai commencé par un stage de quatre mois, d'avril à août 2026, avant d'être pris en alternance. Je développe des outils internes en Python pour automatiser des tâches répétitives et fluidifier les processus de sécurité.",
      ],
      cards: [
        {
          title: "D'où je viens",
          text: "Je viens de Meaux, en Île-de-France. C'est là que j'ai étudié jusqu'au baccalauréat, avant d'intégrer l'ENSEA, une école d'ingénieurs.",
          tags: ["Meaux", "Île-de-France"],
        },
        {
          title: "Un parcours atypique",
          text: "J'ai commencé à l'ENSEA en pensant ne faire que de la data. En chemin, j'ai compris que c'est l'informatique dans son ensemble qui me plaît vraiment, pas seulement un de ses recoins.",
          tags: ["ENSEA", "Data", "Informatique"],
        },
        {
          title: "Le déclic",
          text: "Apprendre Python en deuxième année m'a redonné le goût de l'informatique et poussé à continuer. J'ai exploré des projets open source comme YASB Reborn, appris sur YouTube, regardé comment on fait des jeux vidéo, et expérimenté.",
          tags: ["Python", "Open source", "YASB Reborn", "Jeux vidéo"],
        },
      ],
      valuesTitle: "Mes valeurs",
      values: [
        {
          name: "Curiosité",
          text: "Comprendre comment les choses fonctionnent, de l'open source aux jeux vidéo.",
        },
        {
          name: "Sérieux",
          text: "Soigner ce que je construis et aller au bout.",
        },
        {
          name: "Envie d'apprendre",
          text: "Apprendre en pratiquant : projets, tutoriels, expérimentations.",
        },
      ],
    },
  },

  languages: {
    title: "Langues",
    items: [
      { flag: "🇫🇷", name: "Français", level: "Langue maternelle" },
      { flag: "🇬🇧", name: "Anglais", level: "B1" },
      { flag: "🇪🇸", name: "Espagnol", level: "B1" },
    ],
    interestsTitle: "Centres d'intérêt",
    interests: [
      "Football",
      "Handball",
      "Musique",
      "Jeux vidéo",
      "Data Science",
    ],
  },

  skills: {
    previewTitle: "Compétences & expertise",
    previewCategories: [
      "Code",
      "Web",
      "Data Science",
      "Back End / DevOps",
      "Systèmes & Shell",
      "Outils de dev",
    ],
    previewLink: "Voir toutes mes compétences et leurs niveaux",
    pageTitle: "Compétences & expertise",
    pageIntro:
      "Un tour détaillé des technologies et des outils que j'utilise, avec mon niveau de maîtrise pour chacun.",
    categories: {
      code: {
        title: "Code",
        description:
          "Les langages de base pour mes outils d'automatisation, mes pipelines de données et mes programmes système.",
      },
      web: {
        title: "Web",
        description:
          "Technologies front-end pour construire des interfaces responsives et des sites statiques, dont ce portfolio.",
      },
      data: {
        title: "Data Science",
        description:
          "Outils de manipulation de données, d'analyse statistique et de visualisation, dans mes projets universitaires et personnels.",
      },
      devops: {
        title: "Back End / DevOps",
        description:
          "Outils d'infrastructure utilisés pendant mon stage à la Maison Astéria pour gérer des environnements Linux conteneurisés.",
      },
      os: {
        title: "Systèmes & Shell",
        description:
          "Systèmes d'exploitation et environnements de scripts que j'utilise au quotidien pour le développement et l'administration système.",
      },
      tools: {
        title: "Outils de dev",
        description:
          "Les outils de développement de mon quotidien, du contrôle de version à la prise de notes et aux IDE.",
      },
    },
    legend: {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    },
  },

  experience: {
    previewTitle: "Expérience",
    previewDate: "Avr. 2026 – Aujourd'hui",
    previewRole: "Développeur Python",
    previewCompany: "NOXIA Security • Bailly Romainvilliers",
    previewDescription: "Développement d'outils internes pour l'entreprise.",
    previewLink: "Voir le parcours complet et la formation",
    pageTitle: "Expérience & formation",
    pageIntro:
      "Mon parcours professionnel et universitaire, des stages à l'université.",
    workTitle: "Expérience professionnelle",
    educationTitle: "Formation",
    jobs: {
      noxia: {
        date: "Avr. 2026 – Aujourd'hui",
        title: "Développeur Python",
        company: "NOXIA Security",
        place: "Bailly Romainvilliers",
        description:
          "Développement d'outils internes pour l'entreprise afin de fluidifier les processus de sécurité internes et d'automatiser des tâches opérationnelles répétitives.",
        tags: ["Python", "Automatisation", "Sécurité"],
      },
      asteria: {
        date: "Nov. 2025 – Janv. 2026",
        title: "Stagiaire ingénieur infrastructure & backend Python",
        company: "Maison Astéria",
        place: "Bazainville",
        description:
          "Migration d'une infrastructure de bot farming de Docker vers LXC/Waydroid. Écriture de scripts d'orchestration Python et Bash pour automatiser le cycle de vie des conteneurs, et déploiement de toute la pile sur un serveur Linux.",
        tags: ["Python", "Bash", "LXC", "Waydroid", "Docker", "Linux"],
      },
      rhon: {
        date: "Mai 2025 – Juin 2025",
        title: "Stagiaire développeur Full Stack & automatisation",
        company: "Rhôn Telecom",
        place: "Champs-sur-Marne",
        description:
          "Développement d'outils d'automatisation en VBA et Node.js pour améliorer la productivité interne. Création d'une interface Next.js pour simplifier les opérations réseau et réduire la saisie manuelle entre les services.",
        tags: ["Node.js", "Next.js", "VBA", "Automatisation"],
      },
      scratch: {
        date: "2024",
        title: "Atelier de programmation Scratch pour enfants",
        company: "Stage d'enseignement",
        place: "Cergy",
        description:
          "Conception et animation d'un atelier d'initiation au code pour des enfants. J'ai accompagné les élèves dans leur première expérience de programmation avec Scratch, en développant leur créativité et leur logique grâce à des exercices interactifs.",
        tags: ["Scratch", "Enseignement"],
      },
      alstom: {
        date: "2020",
        title: "Stage d'observation",
        company: "Alstom Transport",
        place: "Le Creusot",
        description:
          "Découverte des procédés industriels et des systèmes de production ferroviaire, avec un aperçu des grands projets d'ingénierie et des chaînes de fabrication.",
        tags: ["Génie industriel", "Systèmes ferroviaires"],
      },
    },
    education: {
      master: {
        year: "2026 – Aujourd'hui",
        title: "M1 Master MIAGE SBI",
        school: "Université Paris 1 Panthéon-Sorbonne",
        place: "Paris",
        description:
          "Première année du master MIAGE (méthodes informatiques appliquées à la gestion des entreprises), parcours SBI, qui associe technologies de l'information, conception et gestion des systèmes d'information.",
        tags: ["MIAGE", "UML"],
      },
      ensea: {
        year: "2023 – 2026",
        title: "Bachelor Human-IT",
        school: "ENSEA",
        place: "Cergy",
        description:
          "Spécialisation en technologies de l'information et en impact sociétal, avec un accent fort sur la data science, le développement logiciel et l'interaction homme-machine.",
        tags: ["Data Science", "Python", "C", "SQL"],
      },
      bac: {
        year: "2023",
        title: "Baccalauréat Général",
        school: "Lycée Bossuet",
        place: "Meaux",
        description:
          "Diplômé avec la spécialité Mathématiques Expertes. J'y ai construit de solides bases en réflexion analytique, en raisonnement mathématique et en résolution de problèmes.",
        tags: ["Mathématiques Expertes"],
      },
    },
  },

  projects: {
    title: "Projets à la une",
    pageTitle: "Projets",
    intro:
      "Une sélection de projets qui illustrent mes compétences en développement logiciel, data science et innovation numérique.",
    getOnObsidian: "Obtenir sur Obsidian",
    viewAll: "Voir tous les projets →",
    previewItems: [
      {
        title: "Nebulux — Thème Obsidian",
        description:
          "Thème sombre personnalisé pour Obsidian, publié sur la bibliothèque communautaire avec plus de 1000 téléchargements.",
      },
      {
        title: "Music Player",
        description:
          "Lecteur de musique de bureau créé avec Python et Tkinter pour parcourir et écouter des fichiers audio locaux.",
      },
      {
        title: "HYPNOTICA",
        description:
          "Un projet de 2e année à l'ENSEA qui explore les applications interactives avec des technologies modernes.",
      },
    ],
    items: {
      nebulux: {
        title: "Nebulux — Thème Obsidian",
        description:
          "Thème sombre personnalisé pour Obsidian, avec une palette de couleurs inspirée des nébuleuses. Publié sur la bibliothèque communautaire officielle d'Obsidian avec plus de 1000 téléchargements.",
        uiDesign: "Design d'interface",
        openSource: "Open Source",
      },
      music: {
        title: "Music Player",
        description:
          "Lecteur de musique de bureau créé avec Python et Tkinter, avec une interface claire pour parcourir et écouter des fichiers audio locaux.",
      },
      hypnotica: {
        title: "HYPNOTICA",
        description:
          "Un projet de 2e année à l'ENSEA qui présente des approches innovantes des applications interactives. Construit avec des technologies modernes, avec une attention particulière portée à l'expérience utilisateur.",
        webDevelopment: "Développement web",
      },
      portfolio: {
        title: "zolenikokolo.com",
        description:
          "Portfolio personnel construit entièrement de zéro en HTML/CSS/JS pur — sans modèle ni framework. Conçu, codé et déployé de bout en bout via GitHub Pages.",
        webDeployment: "Déploiement web",
      },
      scratch: {
        title: "Atelier de programmation Scratch",
        description:
          "Création d'une initiation attrayante à la programmation pour des enfants, avec des supports pédagogiques et des exercices interactifs pour rendre le code accessible et amusant.",
        education: "Éducation",
        teaching: "Enseignement",
        curriculumDesign: "Conception pédagogique",
      },
      data: {
        title: "Projets de Data Science",
        description:
          "Collection de projets d'analyse et de visualisation de données avec Python, Pandas, Numpy et Matplotlib. Exploration de tendances, d'enseignements et de modèles prédictifs.",
        dataAnalysis: "Analyse de données",
      },
    },
  },

  blog: {
    previewTitle: "Sur le blog",
    previewDescription:
      "Mon journal d'apprentissage — notes et synthèses sur ce que j'explore en ce moment.",
    viewAll: "Voir tous les articles →",
    pageTitle: "Blog",
    pageIntro:
      "Mon journal d'apprentissage — notes, résumés et synthèses sur ce que j'explore en ce moment.",
    empty: "Les premiers articles arrivent bientôt.",
    back: "← Retour au blog",
    allArticles: "← Tous les articles",
    by: "Par",
    updatedOn: "mis à jour le",
    summaryTitle: "En bref",
    nextTitle: "Pour aller plus loin",
    nextProjects: "Voir mes projets →",
    nextSkills: "Découvrir mes compétences →",
    rssTitle: "Zoléni Kokolo Zassi — Blog",
    rssDescription:
      "Journal d'apprentissage : notes et synthèses sur la 3D, le développement et l'infrastructure.",
  },

  contact: {
    pageTitle: "Discutons",
    pageIntro:
      "Ouvert aux nouvelles opportunités, aux collaborations, ou simplement à une bonne discussion tech.",
    location: "Localisation",
    email: "E-mail",
    responseTime: "Délai de réponse",
    responseValue: "En général sous 48 h",
    findMe: "Retrouvez-moi sur",
    formTitle: "Envoyer un message",
    formSubtitle:
      "Remplissez le formulaire et votre messagerie s'ouvrira avec le message prêt à envoyer.",
    fullName: "Nom complet",
    fullNamePlaceholder: "Votre nom",
    emailAddress: "Adresse e-mail",
    subject: "Objet",
    subjectPlaceholder: "De quoi s'agit-il ?",
    message: "Message",
    messagePlaceholder: "Dites-m'en plus...",
    send: "Envoyer le message",
    mailBodyName: "Nom",
    mailBodyEmail: "E-mail",
  },

  footer: {
    headingLine1: "Construisons quelque chose",
    headingLine2: "ensemble.",
    contactMe: "Me contacter",
    rights:
      "© 2026 Zoléni Kokolo Zassi — Tous droits réservés. Design et contenu protégés.",
    builtWith: "Conçu avec",
    by: "par Zoléni Kokolo Zassi",
  },

  notFound: {
    title: "Cette page s'est perdue en chemin. :/",
    text: "La page que vous cherchez n'existe pas, a été déplacée, ou n'est jamais sortie du labo. Retournons sur la bonne voie.",
    backHome: "Retour à l'accueil",
    viewProjects: "Voir les projets",
  },
};

export default fr;
