const quizData = {
  questions: [
    {
      id: 1,
      text: "What is your ideal Friday night?",
      answers: [
        {
          text: "Plotting world domination from my secret lair.",
          villain: "magneto",
        },
        {
          text: "Causing a little bit of chaos, just for fun.",
          villain: "joker",
        },
        {
          text: "Working on a complex algorithm to optimize my finances.",
          villain: "lex-luthor",
        },
        {
          text: "Ensuring the universe is perfectly balanced.",
          villain: "thanos",
        },
      ],
    },
    {
      id: 2,
      text: "What is your primary motivation?",
      answers: [
        {
          text: "Protecting my people, by any means necessary.",
          villain: "magneto",
        },
        { text: "To prove that anyone can be broken.", villain: "joker" },
        { text: "Unimaginable power and influence.", villain: "lex-luthor" },
        { text: "Bringing order to a chaotic universe.", villain: "thanos" },
      ],
    },
  ],
  villains: {
    joker: {
      name: "The Joker",
      slug: "joker",
      image: "/images/villains/joker.jpg",
      description:
        "You are an agent of chaos. You don't have a grand plan; you just want to watch the world burn. Your unpredictability is your greatest strength.",
    },
    magneto: {
      name: "Magneto",
      slug: "magneto",
      image: "/images/villains/magneto.jpg",
      description:
        "You are a righteous revolutionary. You fight for a cause you believe in, but your methods are extreme. You are powerful, charismatic, and unwavering.",
    },
    thanos: {
      name: "Thanos",
      slug: "thanos",
      image: "/images/villains/thanos.jpg",
      description:
        "You are a righteous revolutionary. You fight for a cause you believe in, but your methods are extreme. You are powerful, charismatic, and unwavering.",
    },
    "lex-luthor": {
      name: "Lex Luthor",
      slug: "lex-luthor",
      image: "/images/villains/lex-luthor.jpg",
      description:
        "You are a righteous revolutionary. You fight for a cause you believe in, but your methods are extreme. You are powerful, charismatic, and unwavering.",
    },
  },
} as const;

export { quizData };
