// hack
//https://github.com/jsdom/jsdom/issues/1721
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: () =>{ }})
}
