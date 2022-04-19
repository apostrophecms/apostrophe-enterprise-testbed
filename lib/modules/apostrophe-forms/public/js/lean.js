console.log('here we go');

document.body.addEventListener('apostrophe-forms:submission-form', ({ form: form, res: res }) => {
  console.log('res is:', res);
});
