import onChange from 'on-change';

const createPosts = (value, btnName, list) => {
  value.forEach((obj) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.setAttribute('href', obj.link);
    link.id = obj.id;
    link.textContent = obj.title;

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = btnName;

    li.appendChild(link);
    li.appendChild(btn);
    list.prepend(li);
  });
};

const renderCard = (div, name) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  div.appendChild(card);

  const title = document.createElement('div');
  title.classList.add('card-body');
  const headTitle = document.createElement('h2');
  headTitle.classList.add('card-title', 'h-4');
  headTitle.textContent = name;
  title.appendChild(headTitle);
  card.appendChild(title);
};

const renderPosts = (value, instance, btnName) => {
  const postsDiv = document.querySelector('.posts');
  if (!postsDiv.querySelector('.card')) {
    renderCard(postsDiv, instance);
  }
  const cardP = postsDiv.querySelector('.card');

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0', 'posts-list');

  createPosts(value, btnName, ulPosts);
  cardP.appendChild(ulPosts);
};

const renderNewPosts = (value, btnName) => {
  const ul = document.querySelector('.posts-list');
  createPosts(value, btnName, ul);
};

const renderFeeds = (value, instance) => {
  const feedsDiv = document.querySelector('.feeds');

  if (!feedsDiv.querySelector('.card')) {
    renderCard(feedsDiv, instance);
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
};

const renderModal = (value, state, moreB, closeB) => {
  value.classList.add('fw-normal');
  value.classList.add('link-secondary');
  value.classList.remove('fw-bold');

  const post = state.posts.find((elem) => elem.id === value.id);
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticleBtn = document.querySelector('.full-article');
  const closeBtn = document.querySelector('.btn-secondary');
  modalTitle.textContent = post.title;
  modalBody.textContent = post.goal;
  fullArticleBtn.textContent = moreB;
  closeBtn.textContent = closeB;
  fullArticleBtn.setAttribute('href', post.link);
};

const initView = (instance, state) => {
  const input = document.querySelector('input');
  const form = document.querySelector('form');
  const addBtn = form.querySelector('button');

  const watchedState = onChange(state, (path, value) => {
    const para = document.querySelector('.feedback');

    if (path === 'errors') {
      if (value) {
        input.removeAttribute('readonly', 'true');
        addBtn.removeAttribute('disabled');
        input.classList.add('is-invalid');
        para.classList.add('text-danger');
        para.textContent = value;
      }
    }

    if (path === 'posts') {
      renderPosts(value, instance.t('posts'), instance.t('btnView'));
    }

    if (path === 'newPosts') {
      renderNewPosts(value, instance.t('btnView'));
    }

    if (path === 'feeds') {
      addBtn.removeAttribute('disabled');

      input.focus();
      input.value = '';
      input.removeAttribute('readonly', 'true');
      input.classList.remove('is-invalid');

      para.textContent = instance.t('uploadRss');
      para.classList.remove('text-danger');
      para.classList.add('text-success');

      renderFeeds(value, instance.t('feeds'));
    }

    if (path === 'modal') {
      renderModal(value, state, instance.t('btnFullArticle'), instance.t('btnCloseModal'));
    }
  });
  return watchedState;
};

export default initView;
