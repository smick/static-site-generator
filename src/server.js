const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path");

// Create a LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "../public"));

// Express app
const app = express();
const PORT = 8080;

// Inject LiveReload script into served pages
app.use(connectLivereload());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Notify the browser when files change
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
