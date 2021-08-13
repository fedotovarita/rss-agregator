import isEmpty from 'lodash/isEmpty.js';
import axios from 'axios';
import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import validate from './validate.js';
import ru from './locales/ru';
import initState from './watcherRss.js';
import parser from './parser.js';
import repeatingFunc from './timerFunc.js';

export default () => {
  const state = {
    errors: [],
    urls: [],
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('form');

  const newInstance = i18next.createInstance();
  newInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  yup.setLocale({
    string: {
      url: newInstance.t('errors.invalid'),
    },
    mixed: {
      notOneOf: newInstance.t('errors.duplicate'),
    },
  });

  const watchedState = initState(newInstance, state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url, state.urls)
      .then((data) => {
        watchedState.errors = data.message;

        if (isEmpty(watchedState.errors)) {
          state.urls.push(url);

          axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`)
            .then((response) => response.data.contents)
            .then((dataAx) => {
              const parsedData = parser(dataAx);
              const feedObj = {};
              const body = parsedData.querySelector('channel');
              feedObj.title = body.querySelector('title').textContent;
              feedObj.description = body.querySelector('description').textContent;
              feedObj.url = url;
              feedObj.id = _.uniqueId();
              watchedState.feeds.unshift(feedObj);

              const posts = body.querySelectorAll('item');
              const postsToRender = [];
              posts.forEach((post) => {
                const postObj = {};
                postObj.title = post.querySelector('title').textContent;
                postObj.link = post.querySelector('link').textContent;
                postObj.feedId = feedObj.id;
                postsToRender.unshift(postObj);
              });
              postsToRender.forEach((post) => watchedState.posts.unshift(post));
            })
            .catch(() => {
              watchedState.errors = newInstance.t('errors.notRss');
              const index = state.urls.indexOf(url);
              state.urls.splice(index, 1);
            });
        }
      });
  });

  setTimeout(repeatingFunc, 5000, state, watchedState);
};
