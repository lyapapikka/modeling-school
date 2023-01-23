// https://stackoverflow.com/questions/41127548/how-do-i-swap-array-elements-in-an-immutable-fashion-within-a-redux-reducer
export default function swap(items, firstIndex, secondIndex) {
  const results = items.slice();
  const firstItem = items[firstIndex];
  results[firstIndex] = items[secondIndex];
  results[secondIndex] = firstItem;
  return results;
}
