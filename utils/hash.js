// https://stackoverflow.com/questions/11920697/how-to-get-hash-value-in-a-url-in-js
function getHashValue(key) {
  var matches = location.hash.match(new RegExp(key + "=([^&]*)"));
  return matches ? matches[1] : null;
}

export default getHashValue;
