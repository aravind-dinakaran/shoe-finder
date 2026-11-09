(function asoFanShopNewArrivalSortPlp() {
    const GUARD = "__asoFanShopNewArrivalSort_plp";
    const APPLYING = "__asoFanShopNewArrivalSortApplying";
    const ORDER_BY = "newArrival";

    // Monetate Where owns which PLPs run this action (URL contains /c/fan-shop
    // plus related chips). This file only:
    //   1) appends orderBy on the current page Monetate already qualified
    //   2) rewrites later SPA navigations that stay under /c/fan-shop
    //      so the wrap cannot leak onto Hunting, Shoes, etc.

    function isFanShopTree(pathname) {
        const path = String(pathname || "").replace(/\/+$/, "").toLowerCase();
        return path === "/c/fan-shop" || path.indexOf("/c/fan-shop/") === 0;
    }

    function findParam(params, name) {
        const target = name.toLowerCase();
        let match = null;

        params.forEach(function (value, key) {
            if (match === null && String(key).toLowerCase() === target) {
                match = { value: value };
            }
        });

        return match;
    }

    function withOrderBy(urlArg, requireFanShopTree) {
        if (typeof urlArg !== "string" || !urlArg) {
            return urlArg;
        }

        let url;
        try {
            url = new URL(urlArg, location.origin);
        } catch (e) {
            return urlArg;
        }

        if (findParam(url.searchParams, "orderBy")) {
            return urlArg;
        }

        if (requireFanShopTree && !isFanShopTree(url.pathname)) {
            return urlArg;
        }

        const joiner = url.search && url.search !== "?" ? "&" : "?";
        const nextPath = url.pathname + (url.search || "") + joiner + "orderBy=" + ORDER_BY + url.hash;
        const isRelative = !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(urlArg);

        return isRelative ? nextPath : url.origin + nextPath;
    }

    function currentLocation() {
        return location.pathname + location.search + location.hash;
    }

    function applyCurrentUrl(hardReplace) {
        const current = currentLocation();
        const next = withOrderBy(current, false);

        if (next === current) {
            return false;
        }

        if (hardReplace) {
            location.replace(location.origin + next);
            return true;
        }

        window[APPLYING] = true;
        history.replaceState(history.state, "", next);
        window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
        window[APPLYING] = false;
        return true;
    }

    function wrapHistory() {
        ["pushState", "replaceState"].forEach(function (method) {
            const original = history[method];

            if (typeof original !== "function") {
                return;
            }

            history[method] = function (state, title, url) {
                if (typeof url === "string" && url) {
                    url = withOrderBy(url, true);
                }

                return original.call(this, state, title, url);
            };
        });
    }

    if (!window[GUARD]) {
        window[GUARD] = true;
        wrapHistory();
        window.addEventListener("popstate", function () {
            if (window[APPLYING]) {
                return;
            }

            if (!isFanShopTree(location.pathname)) {
                return;
            }

            applyCurrentUrl(false);
        });
    }

    applyCurrentUrl(document.readyState === "loading");
})();
