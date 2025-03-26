const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3003;

// ADDED-----------------------------
const swaggerJsDoc = require("swagger-jsdoc");
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ACS Backend API Assignment",
      version: "1.0.0",
      description: "With user authentication",
    },
    servers: [
      {
        url: "https://backend-assignment-of-career-boot-camp.vercel.app/",
        description: "My API Documentation",
      },
    ],
  },
  apis: ["./routes/auth.js", "./api/routes/todos.js"], // Make sure these paths are correct
};
const specs = swaggerJsDoc(options);
//----------------------------------------------------------------------


async function loadSwaggerDocs() {
  try {
    // This part might be unnecessary if you're using swagger-jsdoc
    // and no longer need the swagger.json file
    const swaggerPath = path.join(__dirname, 'swagger.json');
    const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerDocument = JSON.parse(swaggerFile);

    // Add CORS headers
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    // ADDED----------------------------------------
    app.use(
      "/",
      swaggerUi.serve, // Fixed variable name from swaggerUI to swaggerUi
      swaggerUi.setup(specs, { // Fixed variable name
        customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
        customCssUrl: CSS_URL
      })
    );
    
    // This route conflicts with the Swagger UI route above and will never be reached
    // app.get('/', (req, res) => {
    //   res.send('Hello world');
    // })
    //----------------------------------------------------

    // Add a health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Only listen when not in Vercel environment
    if (process.env.VERCEL !== "1") {
      app.listen(PORT, () => console.log(`Swagger docs running at http://localhost:${PORT}`)); // Fixed template string syntax
    }
  } catch (error) {
    console.error("Error setting up Swagger UI:", error);
    // Add error handling middleware
    app.use((req, res) => {
      res.status(500).json({
        error: 'Failed to load Swagger documentation',
        details: error.message
      });
    });
  }
}

loadSwaggerDocs();

module.exports = app;