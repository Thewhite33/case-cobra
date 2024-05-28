const { createRouteHandler } = require("uploadthing/next");
const { ourFileRouter } = require("./core");
const routeHandler = createRouteHandler({
    router: ourFileRouter,
});

const { GET, POST } = routeHandler;
module.exports = { GET, POST };
