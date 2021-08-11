import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';
import state from './state.js';

const input = document.querySelector('input');

const initView = (instance) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.errors') {
      const para = document.querySelector('.feedback');
      if (!isEmpty(value)) {
        input.classList.add('is-invalid');
        para.classList.remove('text-success');
        para.classList.add('text-danger');
        para.textContent = value.message;
      } else {
        input.classList.remove('is-invalid');
        para.textContent = instance.t('uploadRss');
        para.classList.remove('text-danger');
        para.classList.add('text-success');
        input.focus();
        input.value = '';
      }
    }
  });
  return watchedState;
};

export default initView;
