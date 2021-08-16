import axios from 'axios';
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
    readPosts: [],
  };

  const newInstance = i18next.createInstance();
  newInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    yup.setLocale({
      string: {
        url: newInstance.t('errors.invalid'),
      },
      mixed: {
        notOneOf: newInstance.t('errors.duplicate'),
      },
    });
  });

  const watchedState = initState(newInstance, state);

  const form = document.querySelector('form');
  const input = form.querySelector('input');
  const addBtn = form.querySelector('button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.setAttribute('readonly', 'true');
    addBtn.disabled = true;

    const formData = new FormData(e.target);
    const url = formData.get('url');

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
  });
  setTimeout(repeatingFunc, 5000, state, watchedState);
};
