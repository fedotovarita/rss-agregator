import _ from 'lodash';

const parser = (data, url) => {
  const newParser = new DOMParser();
  const parsedData = newParser.parseFromString(data, 'application/xml');
  const feedObj = {};
  const body = parsedData.querySelector('channel');
  feedObj.title = body.querySelector('title').textContent;
  feedObj.description = body.querySelector('description').textContent;
  feedObj.url = url;
  feedObj.id = _.uniqueId();

  const posts = body.querySelectorAll('item');
  const postsToRender = [];
  posts.forEach((post) => {
    const postObj = {};
    postObj.title = post.querySelector('title').textContent;
    postObj.link = post.querySelector('link').textContent;
    postObj.goal = post.querySelector('description').textContent;
    postObj.feedId = feedObj.id;
    postObj.id = _.uniqueId();
    postsToRender.unshift(postObj);
  });

  return { feedObj, postsToRender };
};
export default parser;
