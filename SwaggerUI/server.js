const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3003;

async function loadSwaggerDocs() {
    try {
        // Read the swagger.json file using fs
        const swaggerPath = path.join(__dirname, 'swagger.json');
        const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
        const swaggerDocument = JSON.parse(swaggerFile);

        // Add CORS headers
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        // Serve Swagger UI
        app.use("/", swaggerUi.serve);
        app.get("/", swaggerUi.setup(swaggerDocument, {
            explorer: true,
            customSiteTitle: "Todo API Documentation"
        }));

        // Add a health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        // Only listen when not in Vercel environment
        if (process.env.VERCEL !== "1") {
            app.listen(PORT, () => console.log(`Swagger docs running at http://localhost:${PORT}`));
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