
function route(pathname, handle) {
    if (typeof handle[pathname] === "function") {
        return handle[pathname]();
    } else {
        return "404 Not found";
    }
}

exports.route = route;