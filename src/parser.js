const parser = (url) => {
  const newParser = new DOMParser();
  const doc = newParser.parseFromString(url, 'application/xml');

  return doc;
};
export default parser;
