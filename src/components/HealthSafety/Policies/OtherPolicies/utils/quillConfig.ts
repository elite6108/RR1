export const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  },
  clipboard: {
    matchVisual: false
  }
};

export const formats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'color', 'background',
  'font',
  'align',
  'link'
];
