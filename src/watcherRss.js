import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';
import state from './state';

const input = document.querySelector('input');

const watchedState = onChange(state, (path, value) => {
  if (path === 'form.errors') {
    const para = document.querySelector('.feedback');
    if (!isEmpty(value)) {
      input.classList.add('is-invalid');
      para.classList.remove('text-success');
      para.classList.add('text-danger');
      console.log(state);
      para.textContent = value.message;
    } else {
      input.classList.remove('is-invalid');
      para.textContent = 'RSS успешно загружен';
      para.classList.remove('text-danger');
      para.classList.add('text-success');
      input.focus();
      input.value = '';
    }
  }
});

export default watchedState;
