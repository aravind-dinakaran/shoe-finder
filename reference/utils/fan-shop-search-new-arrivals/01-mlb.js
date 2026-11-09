(function asoFanShopNewArrivalSortMlb() {
    const LEAGUE = "mlb";
    const GUARD = "__asoFanShopNewArrivalSort_" + LEAGUE;
    const APPLYING = "__asoFanShopNewArrivalSortApplying";
    const ORDER_BY = "newArrival";

    // All MLB team PLP tiles + unique nicknames + fan-shop intent phrases.
    // Excluded collections: All Star, Stars & Stripes, City Connect, Looney Tunes,
    // Armed Forces, On Field 59FIFTY, Minor League.
    // Excluded nicknames: rangers, cardinals, royals, tigers, giants, sox, reds,
    // angels, marlins, twins, pirates, mariners, rays, athletics, guardians (generic).
    const KEYWORDS = [
        "fan shop",
        "fan gear",
        "fan apparel",
        "mlb jersey",
        "mlb jerseys",
        "mlb fan shop",
        "mlb apparel",
        "mlb hat",
        "mlb hats",
        "mlb merch",
        "arizona diamondbacks",
        "diamondbacks",
        "d-backs",
        "dbacks",
        "atlanta braves",
        "braves",
        "baltimore orioles",
        "orioles",
        "boston red sox",
        "red sox",
        "redsox",
        "chicago cubs",
        "cubs",
        "chicago white sox",
        "white sox",
        "whitesox",
        "cincinnati reds",
        "cleveland guardians",
        "colorado rockies",
        "rockies",
        "detroit tigers",
        "houston astros",
        "astros",
        "kansas city royals",
        "kc royals",
        "los angeles angels",
        "la angels",
        "anaheim angels",
        "los angeles dodgers",
        "la dodgers",
        "dodgers",
        "miami marlins",
        "milwaukee brewers",
        "brewers",
        "minnesota twins",
        "mn twins",
        "new york mets",
        "ny mets",
        "mets",
        "new york yankees",
        "ny yankees",
        "yankees",
        "oakland athletics",
        "oakland a's",
        "oakland as",
        "philadelphia phillies",
        "phillies",
        "pittsburgh pirates",
        "san diego padres",
        "padres",
        "san francisco giants",
        "sf giants",
        "seattle mariners",
        "st. louis cardinals",
        "saint louis cardinals",
        "stl cardinals",
        "tampa bay rays",
        "tampa rays",
        "texas rangers",
        "toronto blue jays",
        "blue jays",
        "bluejays",
        "washington nationals",
        "nationals"
    ];

    if (window[GUARD]) {
        return;
    }
    window[GUARD] = true;

    const PHRASES = buildPhrases(KEYWORDS);

    function buildPhrases(keywords) {
        const phrases = [];
        const seen = {};

        keywords.forEach(function (keyword) {
            expand(normalize(keyword)).forEach(function (phrase) {
                if (phrase && !seen[phrase]) {
                    seen[phrase] = true;
                    phrases.push(phrase);
                }
            });
        });

        phrases.sort(function (a, b) {
            return b.length - a.length;
        });

        return phrases;
    }

    function normalize(value) {
        if (!value) {
            return "";
        }

        let text = String(value).replace(/\+/g, " ");

        try {
            text = decodeURIComponent(text);
        } catch (e) {
            // keep decode-failed text
        }

        return text
            .toLowerCase()
            .replace(/[\u2018\u2019\u0060]/g, "'")
            .replace(/\./g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function expand(normalized) {
        if (!normalized) {
            return [];
        }

        return [
            normalized,
            normalized.replace(/\s*&\s*/g, " and "),
            normalized.replace(/-/g, " "),
            normalized.replace(/-/g, "")
        ].map(function (variant) {
            return variant.replace(/\s+/g, " ").trim();
        });
    }

    function escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function hasPhrase(haystack, needle) {
        return new RegExp("(?:^|[^a-z0-9])" + escapeRegex(needle) + "(?:[^a-z0-9]|$)", "i").test(haystack);
    }

    function matchesSearchTerm(term) {
        const haystacks = expand(normalize(term));
        let i;
        let j;

        for (i = 0; i < haystacks.length; i += 1) {
            for (j = 0; j < PHRASES.length; j += 1) {
                if (hasPhrase(haystacks[i], PHRASES[j])) {
                    return true;
                }
            }
        }

        return false;
    }

    function isSearchPath(pathname) {
        return pathname === "/search" || pathname === "/search/";
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

    function withOrderBy(urlArg) {
        if (typeof urlArg !== "string" || !urlArg) {
            return urlArg;
        }

        let url;
        try {
            url = new URL(urlArg, location.origin);
        } catch (e) {
            return urlArg;
        }

        if (!isSearchPath(url.pathname) || findParam(url.searchParams, "orderBy") || !matchesSearchTerm((findParam(url.searchParams, "searchTerm") || {}).value || "")) {
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
        const next = withOrderBy(current);

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
                    url = withOrderBy(url);
                }

                return original.call(this, state, title, url);
            };
        });
    }

    wrapHistory();

    window.addEventListener("popstate", function () {
        if (window[APPLYING]) {
            return;
        }

        applyCurrentUrl(false);
    });

    if (isSearchPath(location.pathname)) {
        applyCurrentUrl(document.readyState === "loading");
    }
})();
