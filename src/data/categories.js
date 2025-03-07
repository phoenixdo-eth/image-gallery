export const PROMPT_CATEGORIES = [
  {
    name: "Affirmations - Love",
    description: "10 unique short affirmations about love per image",
    prompts: [
      "Generate EXACTLY 10 unique short random positive affirmations about love" + 
      " that are 2-7 words each. These should be uplifting and easy to remember." +
      " Each affirmation MUST start with '{prefix}', and focus on self-love," + 
      " romantic love, or universal love. Format as a clean list with EXACTLY 10" +
      " affirmations, each on its own line, without numbering or bullets." +
      " DO NOT include any explanation, context, or additional text." +
      " ONLY return the 10 affirmations."
    ],
    hasOptions: true
  },
  {
    name: "Daily Motivation",
    description: "Complete motivational quote with your chosen date",
    prompts: [
      "Create a completely random motivational quote for today." +
      " Start with the date '{date}' on its own line, then display" +
      " the full quote (30-50 words) about personal growth, courage," +
      " or positive mindset shifts. Make it inspirational and impactful."
    ],
    dateInput: true
  },
  {
    name: "Zodiac Rankings",
    description: "Quirky zodiac ranking",
    prompts: [
      "Create a quirky 'Most likely to ___' ranking with a teenage or college girl" +
      " action. Choose a random 2 to 8 word" +
      " attention-grabbing action you would do. On the first line, display the" +
      " complete phrase 'Most likely to [trait]:' and then randomly" +
      " list all 12 zodiac signs in numbered order from 1 to 12," +
      " with each sign on its own line prefixed by its ranking number" +
      " (e.g., '1. Pisces', '2. Cancer', etc.). Do not provide context." +
      " Just the result."
    ]
  },
  {
    name: "Affirmations - Money",
    description: "10 unique short affirmations about wealth per image",
    prompts: [
      "Generate EXACTLY 10 unique short random positive affirmations" +
      " about money and abundance that are 2-7 words each. These should" +
      " focus on wealth mindset, financial freedom, and prosperity consciousness." +
      " Each affirmation MUST start with '{prefix}' and be empowering." +
      " Format as a clean list with EXACTLY 10 affirmations, each on its own line," +
      " without numbering or bullets. DO NOT include any explanation," +
      " context, or additional text. ONLY return the 10 affirmations."
    ],
    hasOptions: true
  }
];