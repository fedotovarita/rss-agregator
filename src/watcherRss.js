import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

const input = document.querySelector('input');

const initView = (instance, state) => {
  const watchedState = onChange(state, (path, value) => {
    const para = document.querySelector('.feedback');
    if (path === 'errors') {
      if (!isEmpty(value)) {
        para.classList.remove('text-success');
        input.classList.add('is-invalid');
        para.classList.add('text-danger');
        para.textContent = value;
      }
    }
    if (path === 'posts') {
      const postsDiv = document.querySelector('.posts');
      if (!postsDiv.querySelector('.card')) {
        const cardP = document.createElement('div');
        cardP.classList.add('card', 'border-0');
        postsDiv.appendChild(cardP);

        const titleP = document.createElement('div');
        titleP.classList.add('card-body');
        const headTitleP = document.createElement('h2');
        headTitleP.classList.add('card-title', 'h-4');
        headTitleP.textContent = instance.t('posts');
        titleP.appendChild(headTitleP);
        cardP.appendChild(titleP);
      }

      const cardP = postsDiv.querySelector('.card');

      const ulPosts = document.createElement('ul');
      ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
      value.forEach((obj) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        const link = document.createElement('a');
        link.classList.add('fw-bold');
        link.setAttribute('href', obj.link);
        link.textContent = obj.title;
        li.appendChild(link);
        ulPosts.appendChild(li);
      });

      if (cardP.querySelector('ul')) {
        const ulDel = cardP.querySelector('ul');
        ulDel.remove();
      }
      cardP.appendChild(ulPosts);
    }

    if (path === 'feeds') {
      para.textContent = instance.t('uploadRss');
      input.classList.remove('is-invalid');
      para.classList.remove('text-danger');
      para.classList.add('text-success');
      input.focus();
      input.value = '';

      const feedsDiv = document.querySelector('.feeds');
      if (!feedsDiv.querySelector('.card')) {
        const cardF = document.createElement('div');
        cardF.classList.add('card', 'border-0');
        feedsDiv.appendChild(cardF);
        const titleF = document.createElement('div');
        titleF.classList.add('card-body');
        const headTitleP = document.createElement('h2');
        headTitleP.classList.add('card-title', 'h-4');
        headTitleP.textContent = instance.t('feeds');
        titleF.appendChild(headTitleP);
        cardF.appendChild(titleF);
      }
      const cardF = feedsDiv.querySelector('.card');

      const ulFeeds = document.createElement('ul');
      ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
      value.forEach((array) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');

        const title = document.createElement('h3');
        title.textContent = array.title;
        title.classList.add('h6', 'm-0');

        const description = document.createElement('p');
        description.textContent = array.description;
        description.classList.add('m-0', 'small', 'text-black-50');

        li.appendChild(title);
        li.appendChild(description);

        ulFeeds.appendChild(li);
      });
      if (cardF.querySelector('ul')) {
        const ulDel = cardF.querySelector('ul');
        ulDel.remove();
      }
      cardF.appendChild(ulFeeds);
    }
  });
  return watchedState;
};

export default initView;
