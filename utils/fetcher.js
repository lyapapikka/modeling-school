const fetcher = (...args) => fetch(...args).then((res) => res.json());
const countFetcher = (...args) =>
  fetch(...args).then((res) => res.headers.get("content-range").split("/")[1]);

export { countFetcher };
export default fetcher;
