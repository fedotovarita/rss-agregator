import * as yup from 'yup';
import i18next from 'i18next';
import ru from './locales/ru';
import initState from './initState';

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
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');

      initState(url, state, newInstance);
    });
  });
};
