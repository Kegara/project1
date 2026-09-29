import serverModule from "../server/src/index.js";

const app = serverModule.default ?? serverModule;

module.exports = app;
