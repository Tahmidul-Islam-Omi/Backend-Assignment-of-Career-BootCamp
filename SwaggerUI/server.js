const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3003;

async function loadSwaggerDocs() {
    try {
        // Load the local swagger.json file directly
        const swaggerDocument = require('./swagger.json');

        // Serve Swagger UI
        app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
            explorer: true,
            customSiteTitle: "Todo API Documentation"
        }));

        // Only listen when not in Vercel environment
        if (process.env.VERCEL !== "1") {
            app.listen(PORT, () => console.log(`Swagger docs running at http://localhost:${PORT}`));
        }
    } catch (error) {
        console.error("Error setting up Swagger UI:", error);
    }
}

loadSwaggerDocs();

// Export for Vercel serverless function
module.exports = app;