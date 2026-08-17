const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');
const fetchPatch = `
const originalFetch = window.fetch;
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
if(!code.includes('originalFetch')) {
  fs.writeFileSync('src/main.tsx', fetchPatch + code);
}
