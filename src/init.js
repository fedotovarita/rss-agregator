import isEmpty from 'lodash/isEmpty.js';
import axios from 'axios';
import validate from './validateRss';
import watchedState from './watcherRss.js';

export default () => {
  const input = document.querySelector('input');
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = input.value;
    validate(url, watchedState.feeds)
      .then((data) => {
        watchedState.form.errors = data;
        if (isEmpty(watchedState.form.errors)) {
          axios.get(url)
            .then((response) => {
              if (response.headers['content-type'].includes('xml')) {
                watchedState.form.state = 'valid';
                watchedState.feeds.push(url);
                watchedState.form.url = url;
                console.log('correct content-type');
              } else {
                console.log('incorrect content-type');
                watchedState.form.state = 'invalid';
                watchedState.form.errors.push('Incorrect content type');
              }
            })
            .catch(() => {
              console.log('error');
              watchedState.form.state = 'invalid';
              watchedState.form.errors.push('Ресурс не содержит валидный RSS');
            });
        } else {
          watchedState.form.state = 'invalid';
        }
      });
  });
};
