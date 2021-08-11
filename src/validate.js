import * as yup from 'yup';

const validate = (field, urls) => {
  const schema = yup.string().url().notOneOf(urls);
  const promise = schema.validate(field, urls)
    .then(() => [])
    .catch((e) => e);
  return promise;
};
export default validate;
