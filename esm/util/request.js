import fetch from "node-fetch";
function checkStatus(res) {
    if (res.status >= 200 && res.status < 303) {
        return res;
    }
    throw {
        body: res.body,
        message: res.statusText,
        response: res,
        status: res.status
    };
}
export default (url, options) => {
    return fetch(url, options)
        .then(checkStatus)
        .then((res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        }
        return res;
    });
};
//# sourceMappingURL=request.js.map