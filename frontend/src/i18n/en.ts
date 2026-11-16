// Dictionnaire anglais = langue par défaut, servie à la racine du site.
// `fr.ts` est typé sur cette structure : une clé manquante côté français
// est une erreur TypeScript (et tests/i18n.test.js compare aussi les clés).

const en = {
  meta: {
    siteName: "Zoléni Kokolo Zassi",
    home: {
      title: "Zoléni Kokolo Zassi — Python & Linux Infrastructure",
      description:
        "Python developer and M1 MIAGE SBI student at Université Paris 1 Panthéon-Sorbonne, focused on data science and Linux infrastructure. Portfolio and blog.",
    },
    about: {
      title: "About Zoléni Kokolo Zassi — Paris 1 Panthéon-Sorbonne",
      description:
        "Who is Zoléni Kokolo Zassi? A Python developer and M1 MIAGE SBI student at Université Paris 1 Panthéon-Sorbonne — background, interests and languages.",
    },
    skills: {
      title: "Skills & Expertise — Zoléni Kokolo Zassi",
      description:
        "Full overview of Zoléni Kokolo Zassi's technical skills — programming languages, data science, DevOps, and development tools.",
    },
    experience: {
      title: "Experience & Education — Zoléni Kokolo Zassi",
      description:
        "Professional experience and academic background of Zoléni Kokolo Zassi — Python developer, infrastructure engineer, and Paris 1 Panthéon-Sorbonne student.",
    },
    projects: {
      title: "Projects — Zoléni Kokolo Zassi",
      description:
        "A selection of projects showcasing Zoléni Kokolo Zassi's skills in software development, data science, and digital innovation.",
    },
    blog: {
      title: "Blog — Zoléni Kokolo Zassi",
      description:
        "Learning journal: my notes and write-ups on 3D, development, and infrastructure.",
    },
    contact: {
      title: "Contact — Zoléni Kokolo Zassi",
      description:
        "Get in touch with Zoléni Kokolo Zassi — open to opportunities, collaborations, and conversations.",
    },
    notFound: {
      title: "404 — Page Not Found | Zoléni Kokolo Zassi",
      description:
        "This page doesn't exist. Head back to the homepage of Zoléni Kokolo Zassi's portfolio.",
    },
    ogImageAlt:
      "Zoléni Kokolo Zassi — Python Developer, Data Science, Linux Infrastructure",
  },

  person: {
    jobTitle: "Python Developer & Junior Full Stack Developer",
    description:
      "Python developer and M1 MIAGE SBI student at Université Paris 1 Panthéon-Sorbonne, focused on data science and Linux infrastructure.",
  },

  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
    github: "GitHub",
    downloadCv: "Download CV",
    toggleMenu: "Toggle navigation",
    language: "Language",
  },

  common: {
    available: "Available for opportunities",
    location: "Chauconin-Neufmontiers, France",
    viewCode: "View Code",
    backToTop: "Back to top",
  },

  hero: {
    badge: "Welcome to my portfolio",
    title: "Hi, I'm Zoléni Kokolo Zassi",
    leadBefore: "A ",
    leadRole: "Python Developer & Junior Full Stack Developer",
    leadAfter:
      " passionate about automation, infrastructure migration (Docker/LXC), and building concrete end-to-end software solutions. I'm driven by curiosity, creativity, and the desire to solve real-world problems.",
    seeWork: "See My Work",
    getInTouch: "Get in Touch",
    photoAlt: "Zoléni Kokolo Zassi",
  },

  about: {
    title: "My Journey So Far",
    p1Before: "I'm currently pursuing my ",
    p1Highlight: "M1 Master MIAGE SBI at Université Paris 1 Panthéon-Sorbonne",
    p1After:
      ", after a Bachelor Human-IT at ENSEA Cergy, focusing on information technologies and their impact on society. My experiences span infrastructure migration (Docker to LXC/Waydroid), Python/Bash automation scripting, and full stack development.",
    quote:
      '"Fuelled by curiosity, committed to quality, inspired by technology."',
    p2: "My passion lies in automation and building concrete end-to-end solutions — from Linux server deployment to full stack web applications. I love turning complex infrastructure and software challenges into clean, working systems.",
    learnMore: "Learn more about me & my interests",
    pageTitle: "About Zoléni Kokolo Zassi",
    pageIntro:
      "A closer look at who I am, what I care about, and what keeps me curious outside of code.",
    // Contenu propre à la page /about/ (l'accueil garde p1/quote/p2 ci-dessus).
    page: {
      intro: [
        "Hi, I'm Zoléni. I'm from Meaux, in Île-de-France, and my path has been anything but linear.",
        "I'm currently doing an M1 MIAGE SBI at Université Paris 1 Panthéon-Sorbonne, as a work-study student at NOXIA Security, after a Bachelor Human-IT at ENSEA. I started there with a four-month internship, from April to August 2026, before joining them on a work-study contract. I build internal Python tools that automate repetitive tasks and streamline security processes.",
      ],
      cards: [
        {
          title: "Where I come from",
          text: "I come from Meaux, in Île-de-France. That is where I studied up to my baccalauréat, before joining ENSEA, an engineering school.",
          tags: ["Meaux", "Île-de-France"],
        },
        {
          title: "An atypical path",
          text: "I started at ENSEA thinking I would only do data. Along the way I realised that computing as a whole really appeals to me, not just one corner of it.",
          tags: ["ENSEA", "Data", "Computing"],
        },
        {
          title: "The spark",
          text: "Learning Python in my second year made me fall back in love with computing and pushed me to keep going. I explored open source projects such as YASB Reborn, learned from YouTube, looked at how video games are made, and experimented.",
          tags: ["Python", "Open source", "YASB Reborn", "Video games"],
        },
      ],
      valuesTitle: "My values",
      values: [
        {
          name: "Curiosity",
          text: "Understanding how things work, from open source to video games.",
        },
        {
          name: "Seriousness",
          text: "Taking care of what I build and seeing it through.",
        },
        {
          name: "Drive to learn",
          text: "Learning by doing: projects, tutorials, experiments.",
        },
      ],
    },
  },

  languages: {
    title: "Languages",
    items: [
      { flag: "🇫🇷", name: "French", level: "Native" },
      { flag: "🇬🇧", name: "English", level: "B1" },
      { flag: "🇪🇸", name: "Spanish", level: "B1" },
    ],
    interestsTitle: "Interests",
    interests: ["Football", "Handball", "Music", "Gaming", "Data Science"],
  },

  skills: {
    previewTitle: "Skills & Expertise",
    previewCategories: [
      "Code",
      "Web",
      "Data Science",
      "Back End / DevOps",
      "OS & Shell",
      "Dev Tools",
    ],
    previewLink: "See all skills & proficiency levels",
    pageTitle: "Skills & Expertise",
    pageIntro:
      "A detailed look at the technologies and tools I work with, along with my proficiency level in each.",
    categories: {
      code: {
        title: "Code",
        description:
          "Core languages for automation tools, data pipelines, and system-level programs.",
      },
      web: {
        title: "Web",
        description:
          "Frontend technologies used to build responsive interfaces and static sites, including this portfolio.",
      },
      data: {
        title: "Data Science",
        description:
          "Tools for data manipulation, statistical analysis, and visualization across academic and personal projects.",
      },
      devops: {
        title: "Back End / DevOps",
        description:
          "Infrastructure tools used during my internship at Maison Astéria to manage containerized Linux environments.",
      },
      os: {
        title: "OS & Shell",
        description:
          "Operating systems and scripting environments I work with daily for development and system administration.",
      },
      tools: {
        title: "Dev Tools",
        description:
          "Development tools that make up my daily workflow, from version control to note-taking and IDEs.",
      },
    },
    legend: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
  },

  experience: {
    previewTitle: "Experience",
    previewDate: "Apr 2026 – Present",
    previewRole: "Python Developer",
    previewCompany: "NOXIA Security • Bailly Romainvilliers",
    previewDescription: "Development of in-house tools for the company.",
    previewLink: "View full timeline & education details",
    pageTitle: "Experience & Education",
    pageIntro:
      "My professional journey and academic background, from internships to university.",
    workTitle: "Work Experience",
    educationTitle: "Education",
    jobs: {
      noxia: {
        date: "Apr 2026 – Present",
        title: "Python Developer",
        company: "NOXIA Security",
        place: "Bailly Romainvilliers",
        description:
          "Development of in-house tools for the company to streamline internal security workflows and automate repetitive operational tasks.",
        tags: ["Python", "Automation", "Security"],
      },
      asteria: {
        date: "Nov 2025 – Jan 2026",
        title: "Infrastructure & Backend Python Engineer Intern",
        company: "Maison Astéria",
        place: "Bazainville",
        description:
          "Migration of a bot farming infrastructure from Docker to LXC/Waydroid. Wrote Python and Bash orchestration scripts to automate container lifecycle management and deployed the entire stack on a Linux server.",
        tags: ["Python", "Bash", "LXC", "Waydroid", "Docker", "Linux"],
      },
      rhon: {
        date: "May 2025 – Jun 2025",
        title: "Full Stack Developer & Automation Intern",
        company: "Rhôn Telecom",
        place: "Champs-sur-Marne",
        description:
          "Developed automation tools with VBA and Node.js to improve internal productivity. Built a Next.js interface to streamline network operations and reduce manual data entry across departments.",
        tags: ["Node.js", "Next.js", "VBA", "Automation"],
      },
      scratch: {
        date: "2024",
        title: "Scratch Programming Workshop for Children",
        company: "Teaching Internship",
        place: "Cergy",
        description:
          "Designed and led an introductory coding workshop for children. Guided students through their first programming experience using Scratch, fostering creativity and logical thinking through interactive exercises.",
        tags: ["Scratch", "Teaching"],
      },
      alstom: {
        date: "2020",
        title: "Observation Internship",
        company: "Alstom Transport",
        place: "Le Creusot",
        description:
          "Discovered industrial processes and railway production systems, gaining insights into large-scale engineering projects and manufacturing workflows.",
        tags: ["Industrial Engineering", "Railway Systems"],
      },
    },
    education: {
      master: {
        year: "2026 – Present",
        title: "M1 Master MIAGE SBI",
        school: "Université Paris 1 Panthéon-Sorbonne",
        place: "Paris",
        description:
          "First year of the MIAGE master (computer methods applied to business management), SBI track, combining information technology with the design and management of information systems.",
        tags: ["MIAGE", "UML"],
      },
      ensea: {
        year: "2023 – 2026",
        title: "Bachelor Human-IT",
        school: "ENSEA",
        place: "Cergy",
        description:
          "Specializing in information technologies and their societal impact, with a strong focus on data science, software development, and human-computer interaction.",
        tags: ["Data Science", "Python", "C", "SQL"],
      },
      bac: {
        year: "2023",
        title: "Baccalauréat Général",
        school: "Lycée Bossuet",
        place: "Meaux",
        description:
          "Graduated with a specialization in Mathématiques Expertes. Built a strong foundation in analytical thinking, mathematical reasoning, and problem solving.",
        tags: ["Mathématiques Expertes"],
      },
    },
  },

  projects: {
    title: "Featured Projects",
    pageTitle: "Projects",
    intro:
      "A selection of projects showcasing my skills in software development, data science, and digital innovation.",
    getOnObsidian: "Get on Obsidian",
    viewAll: "View all projects →",
    previewItems: [
      {
        title: "Nebulux — Obsidian Theme",
        description:
          "Custom dark theme for Obsidian, published on the community marketplace with 1000+ downloads.",
      },
      {
        title: "Music Player",
        description:
          "Desktop music player built with Python and Tkinter for browsing and playing local audio files.",
      },
      {
        title: "HYPNOTICA",
        description:
          "A 2nd year ENSEA project exploring interactive applications with modern technologies.",
      },
    ],
    items: {
      nebulux: {
        title: "Nebulux — Obsidian Theme",
        description:
          "Custom dark theme for Obsidian featuring a deep nebula-inspired color palette. Published on the official Obsidian community marketplace with 300+ downloads.",
        uiDesign: "UI Design",
        openSource: "Open Source",
      },
      music: {
        title: "Music Player",
        description:
          "Desktop music player built with Python and Tkinter featuring a clean GUI for browsing and playing local audio files.",
      },
      hypnotica: {
        title: "HYPNOTICA",
        description:
          "A 2nd year ENSEA project showcasing innovative approaches to interactive applications. Built with modern technologies and focusing on user experience.",
        webDevelopment: "Web Development",
      },
      portfolio: {
        title: "zolenikokolo.com",
        description:
          "Personal portfolio built entirely from scratch in pure HTML/CSS/JS — no templates, no frameworks. Designed, coded, and deployed via GitHub Pages end-to-end.",
        webDeployment: "Web Deployment",
      },
      scratch: {
        title: "Scratch Programming Workshop",
        description:
          "Created an engaging introduction to programming for children, developing curriculum materials and interactive exercises to make coding accessible and fun.",
        education: "Education",
        teaching: "Teaching",
        curriculumDesign: "Curriculum Design",
      },
      data: {
        title: "Data Science Projects",
        description:
          "Collection of data analysis and visualization projects using Python, Pandas, Numpy, and Matplotlib. Exploring patterns, insights, and predictive modeling.",
        dataAnalysis: "Data Analysis",
      },
    },
  },

  blog: {
    previewTitle: "From the Blog",
    previewDescription:
      "My learning journal — notes and write-ups on what I'm currently exploring.",
    viewAll: "View all articles →",
    pageTitle: "Blog",
    pageIntro:
      "My learning journal — notes, summaries, and write-ups on what I'm currently exploring.",
    empty: "First articles coming soon.",
    back: "← Back to blog",
    allArticles: "← All articles",
    by: "By",
    updatedOn: "updated on",
    rssTitle: "Zoléni Kokolo Zassi — Blog",
    rssDescription:
      "Learning journal: notes and write-ups on 3D, development, and infrastructure.",
  },

  contact: {
    pageTitle: "Let's Connect",
    pageIntro:
      "Open to new opportunities, collaborations, or just a good tech conversation.",
    location: "Location",
    email: "Email",
    responseTime: "Response time",
    responseValue: "Usually within 48h",
    findMe: "Find me on",
    formTitle: "Send a message",
    formSubtitle:
      "Fill in the form and your email client will open with the message ready to send.",
    fullName: "Full name",
    fullNamePlaceholder: "Your name",
    emailAddress: "Email address",
    subject: "Subject",
    subjectPlaceholder: "What's it about?",
    message: "Message",
    messagePlaceholder: "Tell me more...",
    send: "Send message",
    mailBodyName: "Name",
    mailBodyEmail: "Email",
  },

  footer: {
    headingLine1: "Let's build something",
    headingLine2: "together.",
    contactMe: "Contact me",
    rights:
      "© 2026 Zoléni Kokolo Zassi — All rights reserved. Design & content protected.",
    builtWith: "Built with",
    by: "by Zoléni Kokolo Zassi",
  },

  notFound: {
    title: "This page took a wrong turn. :/",
    text: "The page you're looking for doesn't exist, was moved, or never made it out of the lab. Let's get you back on track.",
    backHome: "Back home",
    viewProjects: "View projects",
  },
};

export default en;
export type Dictionary = typeof en;
