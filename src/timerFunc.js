/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';

const repeatingFunc = (state, watchedState) => {
  if (state.feeds.length !== 0) {
    state.feeds.forEach((feed) => {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(feed.url)}&disableCache=true`)
        .then((response) => response.data.contents)
        .then((dataAx) => {
          const data = parser(dataAx);
          const difference = _.differenceBy(data.postsToRender, state.posts, 'title');
          difference.forEach((post) => state.posts.unshift(post));
          watchedState.newPosts = difference;
          const modalBtn = document.querySelectorAll('[data-bs-toggle="modal"]');
          modalBtn.forEach((btn) => {
            btn.addEventListener('click', (evt) => {
              watchedState.modal = evt.target.parentNode.firstChild;
            });
          });
        });
    });
  }
  setTimeout(repeatingFunc, 5000, state, watchedState);
};
export default repeatingFunc;
