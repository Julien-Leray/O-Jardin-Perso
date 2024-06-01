import expressJSDocSwagger from 'express-jsdoc-swagger';

const options = {
  info: {
    version: '0.0.1',
    title: 'O\'Jardin API',
    license: {
      name: 'BSD',
    },
    description: 'Documentation de l\'API O\'Jardin',
    contact: {
      name: 'Team O\'Jardin',
      url: 'https://votre-site-web.com',
      email: 'votre-email@exemple.com'
    },
    servers: [
      { url: 'http://localhost:4000' }
    ]
  },
  baseDir: './app/routers',
  filesPattern: './**/*.js',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};

/**
 * Initialize the swagger documentation
 * @param {object} app - The express app
 */
function initSwagger(app) {
  expressJSDocSwagger(app)(options);
}

export default initSwagger;