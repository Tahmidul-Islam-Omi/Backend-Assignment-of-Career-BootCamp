const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3003;
const SWAGGER_JSON_URL = "http://localhost:3002/api-docs.json";

async function loadSwaggerDocs() {
    try {
        const response = await fetch(SWAGGER_JSON_URL);
        const swaggerDocument = await response.json();

        // Serve Swagger UI
        app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        app.listen(PORT, () => console.log(`Swagger docs running at http://localhost:${PORT}`));
    } catch (error) {
        console.error("Error fetching Swagger JSON:", error);
    }
}

loadSwaggerDocs();