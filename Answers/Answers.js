const wow = [
  {
    word: 'BATMAN',
    hint: "I'm vengeance!!!",
  },
  {
    word: 'DENMARK',
    hint: 'Country that consumes the most cheese!',
  },
  {
    word: 'LORD OF THE RINGS',
    hint: 'One of the most popular movie trilogies',
  },
  {
    word: 'LAST OF US',
    hint: 'Game of the year in 2020',
  },
  {
    word: 'COMIC FRIDAY',
    hint: 'Cool website filled with unfunny comics',
  },
  {
    word: 'BLACK PINK',
    hint: 'Biggest female K-Pop group',
  },
  {
    word: 'NARUTO',
    hint: 'RASENGAN!!!',
  },
  {
    word: 'TINUBU',
    hint: 'is it for eba, garri, beans and dodo?',
  },
  {
    word: 'JAZZ',
    hint: 'music genre that originated from Black American communities',
  },
  {
    word: 'GREEN GOBLIN',
    hint: "Spider-Man's archenemy",
  },
  {
    word: 'SPEEDOMETER',
    hint: 'An important car part',
  },
  {
    word: 'THE VOID',
    hint: 'The name of this game 🤨',
  },
  {
    word: 'THANOS',
    hint: 'I am inevitable!!!',
  },
  {
    word: 'SADIO MANE',
    hint: 'Player to score the fastest hattrick ever',
  },
  {
    word: 'TUNISIA',
    hint: 'African country with the most valuable currency',
  },
  {
    word: 'YEMEN',
    hint: 'The only country in the world that starts with letter Y',
  },
  {
    word: 'BERLIN',
    hint: 'Capital of germany',
  },
  {
    word: 'JAMES CHARLES',
    hint: 'Hi Sisters!!💅🏻🏳️‍🌈',
  },
  {
    word: 'ARES',
    hint: 'Greek God',
  },
  {
    word: 'JAFAR',
    hint: 'Greek God',
  },
  {
    word: 'MOTHER',
    hint: "Your brother's wife's father-inlaw's wife is your...",
  },
  {
    word: 'MUSHROOM',
    hint: 'I am a type of room you can not enter or leave. What am I?',
  },
];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

module.exports.Ideas = shuffle(wow).slice(0, 5);
