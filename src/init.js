import isEmpty from 'lodash/isEmpty.js';
// import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import validate from './validate.js';
import ru from './locales/ru';
import initState from './watcherRss.js';

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
        watchedState.form.errors = data;
        if (isEmpty(watchedState.form.errors)) {
          watchedState.form.state = 'valid';
          watchedState.form.url = url;
          watchedState.feeds.push(url);
        } else {
          watchedState.form.state = 'invalid';
        }
      });
  });
};
