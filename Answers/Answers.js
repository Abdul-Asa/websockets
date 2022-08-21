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

module.exports.Ideas = shuffle(wow);
