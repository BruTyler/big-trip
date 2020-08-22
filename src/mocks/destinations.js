import {generateRandomInt, getRandomSorterRule} from '../utils/random.js';

const wholeDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomDescription = () => {
  const availableSentences = wholeDescription.split(`.`)
    .filter((x) => x !== ``)
    .sort(getRandomSorterRule);

  const sentenceCount = generateRandomInt(1, 5);

  return availableSentences.slice(0, sentenceCount).join(`.`);
};

const getRandomPictures = () => {
  const pictureCount = generateRandomInt(1, 5);
  return new Array(pictureCount)
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const cities = [`Geneva`, `Chamonix`, `Amsterdam`, `Moscow`];

export const generateDestinations = () => cities.map((city) => ({
  name: city,
  description: getRandomDescription(),
  pictures: getRandomPictures(),
}));
