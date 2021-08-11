import * as yup from 'yup';

const errors = {
  invalidUrl: 'Ссылка должна быть валидным URL',
  duplicate: 'RSS уже существует',
};

const validate = (field, urls) => {
  const schema = yup.string().url(errors.invalidUrl).notOneOf(urls, errors.duplicate);
  const promise = schema.validate(field, urls)
    .then(() => [])
    .catch((e) => e);
  return promise;
};

export default validate;
