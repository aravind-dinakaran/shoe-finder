//Insert Any JS
console.warn('A/B Test Control: Optimus Customers Also Bough Widget on PDP');

(function gateItOptimusCabByStack() {
  "use strict";

  var REQUIRED_STACK = "500";
  var HIDDEN_ATTR = "data-aso-hidden-by-stack-cookie";
  var OBSERVER_KEY = "__asoItOptimusCabStackObserver";

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function getText(element) {
    return (element && element.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function setImportant(element, name, value) {
    element.style.removeProperty(name);
    element.style.setProperty(name, value, "important");
  }

  function isCabRoot(element) {
    if (!element || !element.querySelector) {
      return false;
    }

    var title = element.querySelector(".titleXl.textAcademyBlue, [class*='titleXl'][class*='textAcademyBlue']");
    var hasCabTitle = title && getText(title).indexOf("customers also bought") !== -1;
    var hasProducts = !!element.querySelector("[class*='productsBlock']");

    return hasCabTitle && hasProducts;
  }

  function findItOptimusCabRoots() {
    return toArray(document.querySelectorAll(".container--bGp8o")).filter(isCabRoot);
  }

  function applyVisibility() {
    var shouldShow = getCookie("stack") === REQUIRED_STACK;

    findItOptimusCabRoots().forEach(function(root) {
      if (shouldShow) {
        if (root.getAttribute(HIDDEN_ATTR) === "true") {
          root.removeAttribute(HIDDEN_ATTR);
          root.removeAttribute("aria-hidden");
          root.style.removeProperty("display");
        }
      } else {
        root.setAttribute(HIDDEN_ATTR, "true");
        root.setAttribute("aria-hidden", "true");
        setImportant(root, "display", "none");
      }
    });
  }

  applyVisibility();

  if (window[OBSERVER_KEY]) {
    window[OBSERVER_KEY].disconnect();
  }

  window[OBSERVER_KEY] = new MutationObserver(applyVisibility);
  window[OBSERVER_KEY].observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
