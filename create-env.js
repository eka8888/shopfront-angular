const fs = require('fs');

const content = `
export const environment = {
  production: true,
  projectKey: 'shopfrontrss',
  authUrl: 'https://auth.europe-west1.gcp.commercetools.com',
  apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
  clientId: '${process.env.clientId}',
  clientSecret: '${process.env.clientSecret}',
};
`;

fs.mkdirSync('./src/environments', { recursive: true });
fs.writeFileSync('./src/environments/environment.ts', content);