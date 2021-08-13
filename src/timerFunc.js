import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';

const repeatingFunc = (state, watchedState) => {
  const postsArr = [];
  if (state.feeds.length !== 0) {
    state.feeds.forEach((feed) => {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(feed.url)}&disableCache=true`)
        .then((response) => response.data.contents)
        .then((dataAx) => {
          const parsedData = parser(dataAx);
          const body = parsedData.querySelector('channel');
          const postsList = body.querySelectorAll('item');
          postsList.forEach((post) => {
            const postObj = {};
            postObj.title = post.querySelector('title').textContent;
            postObj.link = post.querySelector('link').textContent;
            postObj.feedId = feed.id;
            postsArr.unshift(postObj);
          });
          const difference = _.differenceBy(postsArr, state.posts, 'title');
          console.log(difference);
          difference.forEach((obj) => watchedState.posts.unshift(obj));
        });
    });
  }
  setTimeout(repeatingFunc, 5000, state, watchedState);
};
export default repeatingFunc;
