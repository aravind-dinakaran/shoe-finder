(function asoFanShopNewArrivalSortSearchAll() {
    console.log("[A/B Test] TEST: Default Sort based on New Arrivals ");
    const GUARD = "__asoFanShopNewArrivalSort_searchAll";
    const APPLYING = "__asoFanShopNewArrivalSortApplying";
    const ORDER_BY = "newArrival";

    // One Monetate search experience, one JS action.
    // Do not also run 01–05 on the same experience (duplicate history wraps).
    // Soccer is omitted. Collections that are not teams are omitted.
    //
    // Teams: [full UI name, extra aliases]
    // The full name is used as facet='facet_Team':'Houston Rockets'
    // Intent phrases only add orderBy (no team facet).

    const MLB_TEAMS = [
        ["Arizona Diamondbacks", ["diamondbacks", "d-backs", "dbacks"]],
        ["Atlanta Braves", ["braves"]],
        ["Baltimore Orioles", ["orioles"]],
        ["Boston Red Sox", ["red sox", "redsox"]],
        ["Chicago Cubs", ["cubs"]],
        ["Chicago White Sox", ["white sox", "whitesox"]],
        ["Cincinnati Reds", []],
        ["Cleveland Guardians", []],
        ["Colorado Rockies", ["rockies"]],
        ["Detroit Tigers", []],
        ["Houston Astros", ["astros"]],
        ["Kansas City Royals", ["kc royals"]],
        ["Los Angeles Angels", ["la angels", "anaheim angels"]],
        ["Los Angeles Dodgers", ["la dodgers", "dodgers"]],
        ["Miami Marlins", []],
        ["Milwaukee Brewers", ["brewers"]],
        ["Minnesota Twins", ["mn twins"]],
        ["New York Mets", ["ny mets", "mets"]],
        ["New York Yankees", ["ny yankees", "yankees"]],
        ["Athletics", ["oakland athletics", "oakland a's", "oakland as"]],
        ["Philadelphia Phillies", ["phillies"]],
        ["Pittsburgh Pirates", []],
        ["San Diego Padres", ["padres"]],
        ["San Francisco Giants", ["sf giants"]],
        ["Seattle Mariners", []],
        ["St. Louis Cardinals", ["saint louis cardinals", "stl cardinals"]],
        ["Tampa Bay Rays", ["tampa rays"]],
        ["Texas Rangers", []],
        ["Toronto Blue Jays", ["blue jays", "bluejays"]],
        ["Washington Nationals", ["nationals"]]
    ];

    const NCAA_TEAMS = [
        ["Air Force Falcons", []],
        ["Alabama Crimson Tide", ["crimson tide", "roll tide", "bama"]],
        ["Appalachian State Mountaineers", ["appalachian state", "app state"]],
        ["Arizona Wildcats", []],
        ["Arizona State Sun Devils", ["arizona state", "sun devils", "asu"]],
        ["Arkansas Razorbacks", ["razorbacks"]],
        ["Army Black Knights", []],
        ["Auburn Tigers", ["auburn"]],
        ["Baylor Bears", ["baylor"]],
        ["Boise State Broncos", ["boise state"]],
        ["BYU Cougars", ["byu"]],
        ["Cal Bears", ["cal golden bears", "california golden bears"]],
        ["Cincinnati Bearcats", ["bearcats"]],
        ["Clemson Tigers", ["clemson"]],
        ["Colorado Buffaloes", ["colorado buffs"]],
        ["Duke Blue Devils", ["duke"]],
        ["ECU Pirates", ["east carolina", "ecu"]],
        ["Florida Gators", ["gators"]],
        ["Florida A&M Rattlers", ["florida a&m", "famu", "rattlers"]],
        ["Florida State Seminoles", ["florida state", "seminoles", "fsu"]],
        ["Georgia Bulldogs", ["uga bulldogs", "uga"]],
        ["Georgia Tech Yellow Jackets", ["georgia tech"]],
        ["Gonzaga Bulldogs", ["gonzaga"]],
        ["Houston Cougars", ["uh cougars"]],
        ["Illinois Fighting Illini", ["fighting illini", "illini"]],
        ["Indiana Hoosiers", ["hoosiers"]],
        ["Iowa Hawkeyes", ["hawkeyes"]],
        ["Iowa State Cyclones", ["iowa state", "cyclones"]],
        ["Kansas Jayhawks", ["jayhawks", "ku jayhawks"]],
        ["Kansas State Wildcats", ["kansas state", "k-state", "kstate"]],
        ["Kentucky Wildcats", ["uk wildcats"]],
        ["Louisiana Ragin' Cajuns", ["ragin cajuns", "ragin' cajuns", "ul lafayette"]],
        ["Louisville Cardinals", []],
        ["LSU Tigers", ["lsu"]],
        ["Marshall Thundering Herd", ["thundering herd"]],
        ["Maryland Terrapins", ["terps"]],
        ["Memphis Tigers", []],
        ["Miami Hurricanes", ["um hurricanes"]],
        ["Michigan Wolverines", []],
        ["Michigan State Spartans", ["michigan state", "spartans", "msu spartans"]],
        ["Minnesota Golden Gophers", ["golden gophers", "gophers"]],
        ["Mississippi State Bulldogs", ["mississippi state"]],
        ["Missouri Tigers", ["mizzou"]],
        ["NC State Wolfpack", ["nc state", "wolfpack"]],
        ["Nebraska Cornhuskers", ["cornhuskers", "huskers"]],
        ["North Carolina Tar Heels", ["tar heels", "tarheels", "unc"]],
        ["Northwestern Wildcats", ["northwestern"]],
        ["Notre Dame Fighting Irish", ["notre dame", "fighting irish"]],
        ["Ohio State Buckeyes", ["ohio state", "buckeyes"]],
        ["Oklahoma Sooners", ["sooners"]],
        ["Oklahoma State Cowboys", ["oklahoma state"]],
        ["Ole Miss Rebels", ["ole miss"]],
        ["Oregon Ducks", []],
        ["Oregon State Beavers", ["oregon state"]],
        ["Penn State Nittany Lions", ["penn state", "nittany lions"]],
        ["Pittsburgh Panthers", ["pitt panthers"]],
        ["Purdue Boilermakers", ["purdue", "boilermakers"]],
        ["Rutgers Scarlet Knights", ["rutgers"]],
        ["Sam Houston State Bearkats", ["sam houston", "bearkats"]],
        ["South Carolina Gamecocks", ["gamecocks"]],
        ["South Florida Bulls", ["usf bulls"]],
        ["Southern Mississippi Golden Eagles", ["southern miss"]],
        ["Stanford Cardinal", ["stanford"]],
        ["Syracuse Orange", ["syracuse"]],
        ["TCU Horned Frogs", ["tcu", "horned frogs"]],
        ["Tennessee Volunteers", ["tennessee vols", "vols"]],
        ["Texas Longhorns", ["longhorns", "hook em", "hook'em", "hookem"]],
        ["Texas A&M Aggies", ["texas a&m", "texas a and m", "texas am", "texas aggies", "a&m", "tamu"]],
        ["Texas State Bobcats", ["texas state"]],
        ["Texas Tech Red Raiders", ["texas tech", "red raiders"]],
        ["Tulane Green Wave", ["tulane", "green wave"]],
        ["UCF Knights", ["ucf"]],
        ["UCLA Bruins", ["ucla"]],
        ["UConn Huskies", ["uconn"]],
        ["UL Monroe Warhawks", ["ulm warhawks"]],
        ["USC Trojans", ["southern cal"]],
        ["Utah Utes", ["utes"]],
        ["UTSA Roadrunners", ["utsa"]],
        ["Vanderbilt Commodores", ["vanderbilt", "commodores"]],
        ["Virginia Cavaliers", ["uva", "uva cavaliers"]],
        ["Virginia Tech Hokies", ["virginia tech", "hokies"]],
        ["Wake Forest Demon Deacons", ["wake forest", "demon deacons"]],
        ["Washington Huskies", []],
        ["Washington State Cougars", ["washington state", "wsu cougars"]],
        ["West Virginia Mountaineers", ["west virginia", "wvu"]],
        ["Wisconsin Badgers", ["badgers"]]
    ];

    const NBA_TEAMS = [
        ["Atlanta Hawks", []],
        ["Boston Celtics", ["celtics"]],
        ["Brooklyn Nets", []],
        ["Charlotte Hornets", ["hornets"]],
        ["Chicago Bulls", []],
        ["Cleveland Cavaliers", ["cavs"]],
        ["Dallas Mavericks", ["mavs"]],
        ["Denver Nuggets", []],
        ["Detroit Pistons", []],
        ["Golden State Warriors", ["gsw"]],
        ["Houston Rockets", ["rockets"]],
        ["Indiana Pacers", ["pacers"]],
        ["Los Angeles Clippers", ["la clippers"]],
        ["Los Angeles Lakers", ["la lakers", "lakers"]],
        ["Memphis Grizzlies", []],
        ["Miami Heat", []],
        ["Milwaukee Bucks", []],
        ["Minnesota Timberwolves", ["timberwolves"]],
        ["New Orleans Pelicans", []],
        ["New York Knicks", ["ny knicks", "knicks"]],
        ["Oklahoma City Thunder", ["okc thunder", "okc"]],
        ["Orlando Magic", []],
        ["Philadelphia 76ers", ["76ers", "sixers", "philly 76ers"]],
        ["Phoenix Suns", []],
        ["Portland Trail Blazers", ["trail blazers", "trailblazers"]],
        ["Sacramento Kings", []],
        ["San Antonio Spurs", []],
        ["Toronto Raptors", ["raptors"]],
        ["Utah Jazz", []],
        ["Washington Wizards", []]
    ];

    const NHL_TEAMS = [
        ["Anaheim Ducks", []],
        ["Boston Bruins", ["bruins"]],
        ["Buffalo Sabres", ["buffalo sabers", "sabres", "sabers"]],
        ["Calgary Flames", []],
        ["Carolina Hurricanes", []],
        ["Chicago Blackhawks", ["blackhawks"]],
        ["Colorado Avalanche", ["avs"]],
        ["Columbus Blue Jackets", []],
        ["Dallas Stars", []],
        ["Detroit Red Wings", []],
        ["Edmonton Oilers", ["oilers"]],
        ["Florida Panthers", []],
        ["Los Angeles Kings", ["la kings"]],
        ["Minnesota Wild", []],
        ["Montreal Canadiens", ["habs"]],
        ["Nashville Predators", ["nashville preds", "preds"]],
        ["New Jersey Devils", ["nj devils"]],
        ["New York Islanders", ["ny islanders", "islanders"]],
        ["New York Rangers", ["ny rangers"]],
        ["Ottawa Senators", []],
        ["Philadelphia Flyers", ["philly flyers"]],
        ["Pittsburgh Penguins", ["penguins"]],
        ["San Jose Sharks", ["sj sharks"]],
        ["Seattle Kraken", ["kraken"]],
        ["St. Louis Blues", ["saint louis blues", "stl blues"]],
        ["Tampa Bay Lightning", ["tampa lightning"]],
        ["Toronto Maple Leafs", ["maple leafs"]],
        ["Utah Mammoth", []],
        ["Vancouver Canucks", ["canucks"]],
        ["Vegas Golden Knights", ["vgk"]],
        ["Washington Capitals", []],
        ["Winnipeg Jets", []]
    ];

    const NFL_TEAMS = [
        ["Arizona Cardinals", []],
        ["Atlanta Falcons", []],
        ["Baltimore Ravens", ["ravens"]],
        ["Buffalo Bills", []],
        ["Carolina Panthers", []],
        ["Chicago Bears", []],
        ["Cincinnati Bengals", ["bengals"]],
        ["Cleveland Browns", []],
        ["Dallas Cowboys", []],
        ["Denver Broncos", []],
        ["Detroit Lions", []],
        ["Green Bay Packers", ["packers"]],
        ["Houston Texans", ["texans"]],
        ["Indianapolis Colts", ["indy colts"]],
        ["Jacksonville Jaguars", ["jags"]],
        ["Kansas City Chiefs", ["kc chiefs", "chiefs"]],
        ["Las Vegas Raiders", ["lv raiders", "oakland raiders"]],
        ["Los Angeles Chargers", ["la chargers", "san diego chargers"]],
        ["Los Angeles Rams", ["la rams"]],
        ["Miami Dolphins", []],
        ["Minnesota Vikings", ["vikings"]],
        ["New England Patriots", ["ne patriots"]],
        ["New Orleans Saints", []],
        ["New York Giants", ["ny giants"]],
        ["New York Jets", ["ny jets"]],
        ["Philadelphia Eagles", ["philly eagles"]],
        ["Pittsburgh Steelers", ["steelers"]],
        ["San Francisco 49ers", ["49ers", "sf 49ers", "forty niners", "niners"]],
        ["Seattle Seahawks", ["seahawks"]],
        ["Tampa Bay Buccaneers", ["buccaneers", "tb bucs"]],
        ["Tennessee Titans", []],
        ["Washington Commanders", ["commanders"]]
    ];

    const MLB_INTENT = [
        "fan shop",
        "fan gear",
        "fan apparel",
        "mlb jersey",
        "mlb jerseys",
        "mlb fan shop",
        "mlb apparel",
        "mlb hat",
        "mlb hats",
        "mlb merch"
    ];

    const NCAA_INTENT = [
        "ncaa jersey",
        "ncaa jerseys",
        "ncaa fan shop",
        "ncaa apparel",
        "ncaa hat",
        "ncaa hats",
        "ncaa merch",
        "college jersey",
        "college jerseys",
        "college fan shop"
    ];

    const NBA_INTENT = [
        "nba jersey",
        "nba jerseys",
        "nba fan shop",
        "nba apparel",
        "nba hat",
        "nba hats",
        "nba merch",
        "wnba",
        "wnba jersey",
        "wnba jerseys",
        "wnba fan shop"
    ];

    const NHL_INTENT = [
        "nhl jersey",
        "nhl jerseys",
        "nhl fan shop",
        "nhl apparel",
        "nhl hat",
        "nhl hats",
        "nhl merch"
    ];

    const NFL_INTENT = [
        "nfl jersey",
        "nfl jerseys",
        "nfl fan shop",
        "nfl apparel",
        "nfl hat",
        "nfl hats",
        "nfl merch"
    ];

    const TEAM_LISTS = [MLB_TEAMS, NCAA_TEAMS, NBA_TEAMS, NHL_TEAMS, NFL_TEAMS];
    const INTENT_KEYWORDS = MLB_INTENT.concat(NCAA_INTENT, NBA_INTENT, NHL_INTENT, NFL_INTENT);

    if (window[GUARD]) {
        return;
    }
    window[GUARD] = true;

    const TEAM_PHRASES = buildTeamPhrases(TEAM_LISTS);
    const INTENT_PHRASES = buildPhrases(INTENT_KEYWORDS);

    function buildTeamPhrases(lists) {
        const phrases = [];
        const seen = {};

        lists.forEach(function (teams) {
            teams.forEach(function (entry) {
                const name = entry[0];
                const aliases = [name].concat(entry[1] || []);

                aliases.forEach(function (alias) {
                    expand(normalize(alias)).forEach(function (phrase) {
                        const key = phrase + "\0" + name;
                        if (phrase && !seen[key]) {
                            seen[key] = true;
                            phrases.push({ phrase: phrase, name: name });
                        }
                    });
                });
            });
        });

        phrases.sort(function (a, b) {
            return b.phrase.length - a.phrase.length;
        });

        return phrases;
    }

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

    function findMatchingTeam(term) {
        const haystacks = expand(normalize(term));
        let i;
        let j;

        for (i = 0; i < haystacks.length; i += 1) {
            for (j = 0; j < TEAM_PHRASES.length; j += 1) {
                if (hasPhrase(haystacks[i], TEAM_PHRASES[j].phrase)) {
                    return TEAM_PHRASES[j].name;
                }
            }
        }

        return null;
    }

    function matchesIntent(term) {
        const haystacks = expand(normalize(term));
        let i;
        let j;

        for (i = 0; i < haystacks.length; i += 1) {
            for (j = 0; j < INTENT_PHRASES.length; j += 1) {
                if (hasPhrase(haystacks[i], INTENT_PHRASES[j])) {
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

    function hasTeamFacet(url) {
        let found = false;

        url.searchParams.forEach(function (value, key) {
            if (found || String(key).toLowerCase() !== "facet") {
                return;
            }

            let decoded = value;
            try {
                decoded = decodeURIComponent(value);
            } catch (e) {
                // keep raw value
            }

            if (/facet_team/i.test(decoded)) {
                found = true;
            }
        });

        return found;
    }

    function buildTeamFacetParam(teamName) {
        return "%27facet_Team%27:%27" + encodeURIComponent(teamName).replace(/'/g, "%27") + "%27";
    }

    function appendQuery(search, pair) {
        if (!search || search === "?") {
            return "?" + pair;
        }

        return search + (search.charAt(search.length - 1) === "&" ? "" : "&") + pair;
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

        if (!isSearchPath(url.pathname) || findParam(url.searchParams, "orderBy")) {
            return urlArg;
        }

        const term = (findParam(url.searchParams, "searchTerm") || {}).value || "";
        const teamName = findMatchingTeam(term);

        if (!teamName && !matchesIntent(term)) {
            return urlArg;
        }

        let search = url.search || "";

        if (teamName && !hasTeamFacet(url)) {
            search = appendQuery(search, "facet=" + buildTeamFacetParam(teamName));
        }

        search = appendQuery(search, "orderBy=" + ORDER_BY);

        const nextPath = url.pathname + search + url.hash;
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
