const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const badPatch = `const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('sessionId');
  if (token && resource.toString().startsWith('/api')) {
    config = config || {};
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return originalFetch(resource, config);
};
`;

const goodPatch = `const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('sessionId');
  if (token && resource.toString().startsWith('/api')) {
    config = config || {};
    if (config.headers instanceof Headers) {
      config.headers.set('Authorization', 'Bearer ' + token);
    } else {
      config.headers = { ...config.headers, 'Authorization': 'Bearer ' + token };
    }
  }
  return originalFetch(resource, config);
};
`;

code = code.replace(badPatch, goodPatch);
fs.writeFileSync('src/main.tsx', code);
