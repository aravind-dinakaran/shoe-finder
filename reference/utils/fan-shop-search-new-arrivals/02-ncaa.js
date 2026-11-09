(function asoFanShopNewArrivalSortNcaa() {
    const LEAGUE = "ncaa";
    const GUARD = "__asoFanShopNewArrivalSort_" + LEAGUE;
    const APPLYING = "__asoFanShopNewArrivalSortApplying";
    const ORDER_BY = "newArrival";

    // All NCAA team PLP tiles + unique nicknames + fan-shop intent phrases.
    // Excluded collections: NCAA Tailgate Gear, HBCU Apparel.
    // Excluded nicknames: tigers, bulldogs, wildcats, cougars, huskies, mountaineers,
    // aggies, cowboys, ducks, bears, panthers, knights, rebels, cardinals, eagles,
    // falcons, broncos, wolverines (Wolverine brand), osu (multi-school), trojans
    // (Trojan brand), and standalone state names.
    const KEYWORDS = [
        "ncaa jersey",
        "ncaa jerseys",
        "ncaa fan shop",
        "ncaa apparel",
        "ncaa hat",
        "ncaa hats",
        "ncaa merch",
        "college jersey",
        "college jerseys",
        "college fan shop",
        "air force falcons",
        "alabama crimson tide",
        "crimson tide",
        "roll tide",
        "bama",
        "appalachian state mountaineers",
        "appalachian state",
        "app state",
        "arizona wildcats",
        "arizona state sun devils",
        "arizona state",
        "sun devils",
        "asu",
        "arkansas razorbacks",
        "razorbacks",
        "army black knights",
        "auburn tigers",
        "auburn",
        "baylor bears",
        "baylor",
        "boise state broncos",
        "boise state",
        "byu cougars",
        "byu",
        "cal bears",
        "cal golden bears",
        "california golden bears",
        "cincinnati bearcats",
        "bearcats",
        "clemson tigers",
        "clemson",
        "colorado buffaloes",
        "colorado buffs",
        "duke blue devils",
        "duke",
        "ecu pirates",
        "east carolina",
        "ecu",
        "florida gators",
        "gators",
        "florida a&m rattlers",
        "florida a&m",
        "famu",
        "rattlers",
        "florida state seminoles",
        "florida state",
        "seminoles",
        "fsu",
        "georgia bulldogs",
        "uga bulldogs",
        "uga",
        "georgia tech yellow jackets",
        "georgia tech",
        "gonzaga bulldogs",
        "gonzaga",
        "houston cougars",
        "uh cougars",
        "illinois fighting illini",
        "fighting illini",
        "illini",
        "indiana hoosiers",
        "hoosiers",
        "iowa hawkeyes",
        "hawkeyes",
        "iowa state cyclones",
        "iowa state",
        "cyclones",
        "kansas jayhawks",
        "jayhawks",
        "ku jayhawks",
        "kansas state wildcats",
        "kansas state",
        "k-state",
        "kstate",
        "kentucky wildcats",
        "uk wildcats",
        "louisiana ragin' cajuns",
        "ragin cajuns",
        "ragin' cajuns",
        "ul lafayette",
        "louisville cardinals",
        "lsu tigers",
        "lsu",
        "marshall thundering herd",
        "thundering herd",
        "maryland terrapins",
        "terps",
        "memphis tigers",
        "miami hurricanes",
        "um hurricanes",
        "michigan wolverines",
        "michigan state spartans",
        "michigan state",
        "spartans",
        "msu spartans",
        "minnesota golden gophers",
        "golden gophers",
        "gophers",
        "mississippi state bulldogs",
        "mississippi state",
        "missouri tigers",
        "mizzou",
        "nc state wolfpack",
        "nc state",
        "wolfpack",
        "nebraska cornhuskers",
        "cornhuskers",
        "huskers",
        "north carolina tar heels",
        "tar heels",
        "tarheels",
        "unc",
        "northwestern wildcats",
        "northwestern",
        "notre dame fighting irish",
        "notre dame",
        "fighting irish",
        "ohio state buckeyes",
        "ohio state",
        "buckeyes",
        "oklahoma sooners",
        "sooners",
        "oklahoma state cowboys",
        "oklahoma state",
        "ole miss rebels",
        "ole miss",
        "oregon ducks",
        "oregon state beavers",
        "oregon state",
        "penn state nittany lions",
        "penn state",
        "nittany lions",
        "pittsburgh panthers",
        "pitt panthers",
        "purdue boilermakers",
        "purdue",
        "boilermakers",
        "rutgers scarlet knights",
        "rutgers",
        "sam houston state bearkats",
        "sam houston",
        "bearkats",
        "south carolina gamecocks",
        "gamecocks",
        "south florida bulls",
        "usf bulls",
        "southern mississippi golden eagles",
        "southern miss",
        "stanford cardinal",
        "stanford",
        "syracuse orange",
        "syracuse",
        "tcu horned frogs",
        "tcu",
        "horned frogs",
        "tennessee volunteers",
        "tennessee vols",
        "vols",
        "texas longhorns",
        "longhorns",
        "hook em",
        "hook'em",
        "hookem",
        "texas a&m aggies",
        "texas a&m",
        "texas a and m",
        "texas am",
        "texas aggies",
        "a&m",
        "tamu",
        "texas state bobcats",
        "texas state",
        "texas tech red raiders",
        "texas tech",
        "red raiders",
        "tulane green wave",
        "tulane",
        "green wave",
        "ucf knights",
        "ucf",
        "ucla bruins",
        "ucla",
        "uconn huskies",
        "uconn",
        "ul monroe warhawks",
        "ulm warhawks",
        "usc trojans",
        "southern cal",
        "utah utes",
        "utes",
        "utsa roadrunners",
        "utsa",
        "vanderbilt commodores",
        "vanderbilt",
        "commodores",
        "virginia cavaliers",
        "uva",
        "uva cavaliers",
        "virginia tech hokies",
        "virginia tech",
        "hokies",
        "wake forest demon deacons",
        "wake forest",
        "demon deacons",
        "washington huskies",
        "washington state cougars",
        "washington state",
        "wsu cougars",
        "west virginia mountaineers",
        "west virginia",
        "wvu",
        "wisconsin badgers",
        "badgers"
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
