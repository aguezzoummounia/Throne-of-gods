const quizData = {
  questions: [
    {
      id: 1,
      text: "When power slips from your grasp, how do you reclaim it?",
      answers: [
        {
          text: "Outwit those above me",
          villain: "leticia",
          // Leticia, Isolde
        },
        {
          text: "Burn the world if I must",
          villain: "eternal-flames",
          // Agon, Order of Eternal Flames
        },
        {
          text: "Wait in the shadows. The deeper the patience, the sharper the strike",
          villain: "harald",
          // Queen of the Deep, Harald
        },
        {
          text: "Declare myself chosen. Those who disagree are unworthy",
          villain: "agon",
          // Jarvan I, Agon
        },
        {
          text: "Crush the weak and rebuild my empire from their bones",
          villain: "valeon",
          // Nicolas, Valeon
        },
      ],
    },
    {
      id: 2,
      text: "What would you sacrifice for eternal control?",
      answers: [
        {
          text: "Love. It’s a weakness I buried long ago",
          villain: "isolde",
          // Isolde, Queen of the Deep
        },
        {
          text: "The lives of others",
          villain: "agon",
          // Agon, Order of Eternal Flames
        },
        {
          text: "My name, my past, even my soul. Only power matters",
          villain: "harald",
          // Valeon, Harald
        },
        {
          text: "Nothing. Control is my birthright, not a bargain",
          villain: "jarvan",
        },
        {
          text: " Everything. Especially those who ever doubted me",
          villain: "leticia",
          // Leticia, Nicolas
        },
      ],
    },
    {
      id: 3,
      text: "When confronted with betrayal, how do you respond?",
      answers: [
        {
          text: "I feign ignorance… until the knife turns in their gut",
          villain: "isolde",
          // Leticia, Isolde
        },
        {
          text: "I declare holy vengeance, with flames for justice",
          villain: "eternal-flames",
          // Agon, Order of Eternal Flames
        },
        {
          text: "I disappear. But they drown in nightmares of my return",
          villain: "queen-of-deep",
        },
        {
          text: "I strike first. Let none dare betray me again",
          villain: "jarvan",
        },
        {
          text: "I make them beg for forgiveness… and then flay their name from history",
          villain: "nicolas",
          //Nicolas, Valeon
        },
      ],
    },
    {
      id: 4,
      text: "What is your legacy, carved in blood and history",
      answers: [
        {
          text: "A kingdom built from shadows, puppets, and lies",
          villain: "leticia",
          // Isolde, Leticia
        },
        {
          text: "A war cry that still echoes through burning altars",
          villain: "agon",
          // Agon, Order of Eternal Flames
        },
        {
          text: "A name erased by gods… and returned through vengeance",
          villain: "queen-of-deep",
          // Valeon, Harald
        },
        {
          text: "The first to silence heaven. The last to kneel",
          villain: "jarvan",
        },
        {
          text: "None will speak of me kindly. But they will remember",
          villain: "leticia",
          // Nicolas, Harald, Valeon
        },
      ],
    },
    {
      id: 5,
      text: "Which quote resonates with your soul the most?",
      answers: [
        {
          text: "The weak pray. The strong rule",
          villain: "jarvan",
        },
        { text: "Gold burns brighter than glory.", villain: "valeon" },
        { text: "Power is beauty. Beauty is control.", villain: "leticia" },
        {
          text: "Let the world believe my pain if it keeps me on the throne.",
          villain: "isolde",
        },
        {
          text: "We rose from darkness to reclaim the sun.",
          villain: "king-of-deep",
        },
      ],
    },
    {
      id: 6,
      text: "In the end, what do you truly seek?",
      answers: [
        {
          text: "Immortality through legacy and wealth.",
          villain: "valeon",
        },
        { text: "Control everything from the shadows.", villain: "leticia" },
        {
          text: "To stay in charge, no matter who I have to hurt",
          villain: "isolde",
        },
        {
          text: "To break all rules and become more powerful than the gods",
          villain: "jarvan",
        },
        { text: "To feel strong by keeping others weak", villain: "nicolas" },
      ],
    },
  ],
  villains: {
    jarvan: {
      name: "Jarvan the First",
      slug: "jarvan",
      image: "/images/villains/joker.jpg",
      description:
        "He ruled Galeeria and corrupted divine power. He outlawed prayer and burned temples, declaring, “The strong rule,” and “The weak pray”. His actions contributed to the world's cracking through clashing powers",
    },
    valeon: {
      name: "Valeon",
      slug: "valeon",
      image: "/images/villains/magneto.jpg",
      description:
        "He turned his sacred flame into currency, churning steel for any king with gold, and profited from the war between Jarvan and Crascius. He is mentioned to have died from a blood curse that now plagues his lineage, which is believed to be the same affliction that impacted Reynold and Queen Isolde's son",
    },
    leticia: {
      name: "Empress Leticia",
      slug: "leticia",
      image: "/images/villains/thanos.jpg",
      description:
        "She was so beautiful that Jarvan XI fell for her, but she craved power after giving him three sons. She is portrayed as ruthless and manipulative, orchestrating a plot to frame Kaen for Emperor Jarvan XI's murder and then attempting to have him killed at the funeral. She despises Kaen and vows to make his existence 'ash and memory'. Kaen views her as a 'masterpiece of cruelty waltzing hand-in-hand with doom'",
    },
    agon: {
      name: "Prince Agon",
      slug: "agon",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "He was arrogant and believed himself divinely chosen, with the court and clergy supporting his claim to the throne. He accused Kaen of patricide and, despite Kaen's claims of innocence, delivered the killing blow to Kaen at the funeral. He was defeated by Kaen's sudden awakening of divine lightning during the Crown Prince Tournament",
    },
    isolde: {
      name: "Queen Isolde Thalakar",
      slug: "isolde",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "She is described as ruthless, calculating, and impossibly wealthy. She married into power and refuses to yield authority to her son, even though he is an adult. She believes only in power and manipulates public perception, notably by physically harming her own son, Teralion, to create the illusion that he suffers from the Valeon blood curse and thus affirming her divine right to rule. She abducted Sir Anthony to prevent him from revealing truths and declared the Duke's family traitors. She shows no remorse for her actions, including letting her husband die",
    },
    "eternal-flames": {
      name: "The Order of Eternal Flames",
      slug: "eternal-flames",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "They preach purity and fire and gained significant influence, even reaching Galeeria's throne. They declared Agon the 'true heir chosen by the gods'. Kaen and Jarvan XI aim to 'wipe' them from the world. Kaen intends to strip them of their power, wealth, and influence, including burning their temples",
    },
    nicolas: {
      name: "Nicolas",
      slug: "nicolas",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "He was arrogant and believed himself divinely chosen, with the court and clergy supporting his claim to the throne. He accused Kaen of patricide and, despite Kaen's claims of innocence, delivered the killing blow to Kaen at the funeral. He was defeated by Kaen's sudden awakening of divine lightning during the Crown Prince Tournament",
    },
    harald: {
      name: "Harald",
      slug: "harald",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "He was another overseer who tried to seize Kaen after Nicolas's death and initially believed Kaen to be possessed by a devil. He is later revealed to be a trained soldier in a covert military operation",
    },
    "king-of-deep": {
      name: "King of the deep",
      slug: "king-of-deep",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "They served as the primary antagonists in the War of Depths, leading monstrous creatures that crawled up from the deep and caused widespread devastation. They represented unity, purpose, and love, qualities that the three emperors lacked. Both turned to ash and rode the wind away after Goddess Law commanded them to return to the depths",
    },
    "queen-of-deep": {
      name: "Queen of the deep",
      slug: "king-of-Queen",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "They served as the primary antagonists in the War of Depths, leading monstrous creatures that crawled up from the deep and caused widespread devastation. They represented unity, purpose, and love, qualities that the three emperors lacked. Both turned to ash and rode the wind away after Goddess Law commanded them to return to the depths",
    },
  },
} as const;

export { quizData };
