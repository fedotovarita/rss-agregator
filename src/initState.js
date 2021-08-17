import axios from 'axios';
import validate from './validate.js';
import parser from './parser.js';
import watcher from './watcherRss.js';
import repeatingFunc from './timerFunc.js';

const initState = (url, state, newInstance) => {
  const watchedState = watcher(state, newInstance);

  watchedState.loading = url;
  validate(url, state.urls)
    .then((data) => {
      watchedState.errors = data.message;

      if (!data.message) {
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
          .then((response) => response.data.contents)
          .then((dataAx) => {
            const result = parser(dataAx, url);
            state.urls.push(url);
            watchedState.feeds.unshift(result.feedObj);
            if (state.urls.length === 1) {
              watchedState.posts = result.postsToRender;
            } else {
              result.postsToRender.forEach((p) => state.posts.unshift(p));
              watchedState.newPosts = result.postsToRender;
            }
            const modalBtn = document.querySelectorAll('[data-bs-toggle="modal"]');
            modalBtn.forEach((btn) => {
              btn.addEventListener('click', (evt) => {
                watchedState.modal = evt.target.parentNode.firstChild;
              });
            });
            const postLinks = document.querySelectorAll('.post-link');
            postLinks.forEach((link) => {
              link.addEventListener('click', (ev) => {
                watchedState.link = ev.target;
              });
            });
          })
          .catch((err) => {
            console.log(err.message);
            watchedState.errors = err.message === 'Network Error'
              ? newInstance.t('errors.network')
              : newInstance.t('errors.notRss');
          });
      }
    });

  setTimeout(repeatingFunc, 5000, state, watchedState);
};
export default initState;
