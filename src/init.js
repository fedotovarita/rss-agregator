import isEmpty from 'lodash/isEmpty.js';
import axios from 'axios';
import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import validate from './validate.js';
import ru from './locales/ru';
import initState from './watcherRss.js';
import parser from './parser.js';

export default () => {
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

  const watchedState = initState(newInstance);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url, watchedState.feeds)
      .then((data) => {
        watchedState.form.errors = data.message;
        if (isEmpty(watchedState.form.errors)) {
          watchedState.form.state = 'valid';
          watchedState.form.url = url;
          watchedState.feeds.unshift(url);

          axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
            .then((response) => {
              console.log(response.data.contents);
              return response.data.contents;
            })
            .then((dataAx) => {
              const parsedData = parser(dataAx);
              const feedObj = {};
              const body = parsedData.querySelector('channel');
              feedObj.title = body.querySelector('title').textContent;
              feedObj.description = body.querySelector('description').textContent;
              feedObj.id = _.uniqueId();
              watchedState.feeds.unshift(feedObj);

              const posts = body.querySelectorAll('item');
              const postsArr = [];
              posts.forEach((post) => {
                const postObj = {};
                postObj.title = post.querySelector('title').textContent;
                postObj.link = post.querySelector('link').textContent;
                postObj.feedId = feedObj.id;
                postsArr.push(postObj);
              });
              watchedState.posts.unshift(postsArr);
            })
            .catch(() => {
              if (watchedState.form.errors === undefined) {
                watchedState.form.errors = newInstance.t('errors.notRss');
              }
              const index = watchedState.feeds.indexOf(url);
              watchedState.feeds.splice(index, 1);
              watchedState.form.state = 'invalid';
            });
        } else {
          watchedState.form.state = 'invalid';
        }
      });
  });
};
