// Essential communicative sentences needed to build a foundational language model
// Categorized by high-priority communicative domains for Dimasa

export const essentialCategories = [
  { id: 'all', label: 'All Essential Phrases', icon: '🔥' },
  { id: 'greetings', label: 'Greetings & Etiquette', icon: '👋' },
  { id: 'questions', label: 'Daily Questions', icon: '❓' },
  { id: 'travel', label: 'Travel & Wayfinding', icon: '🚶' },
  { id: 'food', label: 'Food, Dining & Home', icon: '🍚' },
  { id: 'work', label: 'Nature, Animals & Work', icon: '🌿' },
  { id: 'emergency', label: 'Health & Emergencies', icon: '🩺' }
];

export const essentialPhrases = [
  // Greetings & Etiquette
  {
    id: 'ep-1',
    english: "Good morning, how are you?",
    category: 'greetings',
    priority: 'high',
    context: "Everyday morning greeting to friends or elders"
  },
  {
    id: 'ep-2',
    english: "Thank you very much for your help.",
    category: 'greetings',
    priority: 'high',
    context: "Expressing gratitude"
  },
  {
    id: 'ep-3',
    english: "Welcome to our home, please sit down.",
    category: 'greetings',
    priority: 'high',
    context: "Welcoming a guest"
  },
  {
    id: 'ep-4',
    english: "Goodbye, see you again tomorrow.",
    category: 'greetings',
    priority: 'medium',
    context: "Parting phrase"
  },
  {
    id: 'ep-5',
    english: "Nice to meet you.",
    category: 'greetings',
    priority: 'medium',
    context: "Meeting someone for the first time"
  },

  // Daily Questions
  {
    id: 'ep-6',
    english: "Where are you going?",
    category: 'questions',
    priority: 'high',
    context: "Common street greeting / inquiry"
  },
  {
    id: 'ep-7',
    english: "What is your name?",
    category: 'questions',
    priority: 'high',
    context: "Inquiring identity"
  },
  {
    id: 'ep-8',
    english: "What are you doing right now?",
    category: 'questions',
    priority: 'high',
    context: "Conversational inquiry"
  },
  {
    id: 'ep-9',
    english: "When will you come back?",
    category: 'questions',
    priority: 'high',
    context: "Asking about return time"
  },
  {
    id: 'ep-10',
    english: "Can you speak Dimasa?",
    category: 'questions',
    priority: 'high',
    context: "Asking about language ability"
  },
  {
    id: 'ep-11',
    english: "Why are you laughing?",
    category: 'questions',
    priority: 'medium',
    context: "Playful conversational question"
  },
  {
    id: 'ep-12',
    english: "How much does this cost?",
    category: 'questions',
    priority: 'high',
    context: "Market purchase inquiry"
  },

  // Travel & Wayfinding
  {
    id: 'ep-13',
    english: "Which road goes to the market?",
    category: 'travel',
    priority: 'high',
    context: "Asking for directions"
  },
  {
    id: 'ep-14',
    english: "How far is your village from here?",
    category: 'travel',
    priority: 'high',
    context: "Asking about distance"
  },
  {
    id: 'ep-15',
    english: "I am going to the river to bathe.",
    category: 'travel',
    priority: 'medium',
    context: "Daily errand / routine"
  },
  {
    id: 'ep-16',
    english: "Please show me the way to the school.",
    category: 'travel',
    priority: 'medium',
    context: "Asking a local for assistance"
  },
  {
    id: 'ep-17',
    english: "Come with me, let's walk together.",
    category: 'travel',
    priority: 'medium',
    context: "Inviting someone along"
  },

  // Food, Dining & Home
  {
    id: 'ep-18',
    english: "I am hungry, is food ready?",
    category: 'food',
    priority: 'high',
    context: "Mealtime conversation"
  },
  {
    id: 'ep-19',
    english: "Please give me a cup of hot tea.",
    category: 'food',
    priority: 'high',
    context: "Requesting tea"
  },
  {
    id: 'ep-20',
    english: "I am drinking fresh water.",
    category: 'food',
    priority: 'high',
    context: "Basic sentence"
  },
  {
    id: 'ep-21',
    english: "We cooked rice and curry today.",
    category: 'food',
    priority: 'high',
    context: "Talking about meals"
  },
  {
    id: 'ep-22',
    english: "The food is very delicious.",
    category: 'food',
    priority: 'medium',
    context: "Complimenting food"
  },
  {
    id: 'ep-23',
    english: "I am tired, I will sleep now.",
    category: 'food',
    priority: 'medium',
    context: "Nighttime routine"
  },

  // Nature, Animals & Work
  {
    id: 'ep-24',
    english: "It is raining heavily outside.",
    category: 'work',
    priority: 'high',
    context: "Describing weather"
  },
  {
    id: 'ep-25',
    english: "The sun is shining brightly today.",
    category: 'work',
    priority: 'medium',
    context: "Describing weather"
  },
  {
    id: 'ep-26',
    english: "The tiger is roaming in the jungle.",
    category: 'work',
    priority: 'high',
    context: "Describing wildlife"
  },
  {
    id: 'ep-27',
    english: "Be careful, the river water is deep.",
    category: 'work',
    priority: 'high',
    context: "Warning someone"
  },
  {
    id: 'ep-28',
    english: "The birds are flying in the sky.",
    category: 'work',
    priority: 'medium',
    context: "Observing nature"
  },
  {
    id: 'ep-29',
    english: "He went to the field to work.",
    category: 'work',
    priority: 'high',
    context: "Daily agriculture / work"
  },

  // Health & Emergencies
  {
    id: 'ep-30',
    english: "I am not feeling well today.",
    category: 'emergency',
    priority: 'high',
    context: "Expressing sickness"
  },
  {
    id: 'ep-31',
    english: "Please help me quickly!",
    category: 'emergency',
    priority: 'high',
    context: "Urgent call for help"
  },
  {
    id: 'ep-32',
    english: "I have a headache and fever.",
    category: 'emergency',
    priority: 'high',
    context: "Describing symptoms"
  },
  {
    id: 'ep-33',
    english: "Drink this medicine with warm water.",
    category: 'emergency',
    priority: 'medium',
    context: "Medical advice"
  }
];
