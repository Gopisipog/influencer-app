const fs = require('fs');
const path = require('path');

const environmentFile = path.join(__dirname, 'src/environments/environment.production.ts');

const content = `
export const environment = {
  production: true,
  perplexityApiKey: '${process.env.PERPLEXITY_API_KEY || ''}',
  openAiApiKey: '${process.env.OPENAI_API_KEY || ''}'
};
`;

fs.writeFileSync(environmentFile, content);