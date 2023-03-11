// ==UserScript==
// @name         Lab Debug Mode
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Lab Debug Mode
// @author       You
// @match        https://*.cloudacademy.com/*
// @match        https://*.app.qa.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/debug-mode.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/debug-mode.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const debug_lab_selector = "[data-cy=GridCol] > [data-cy=box] > [data-cy=button] > [data-cy=button-label] > [data-cy=text]";
    waitForKeyElements(debug_lab_selector, debug_lab);

    function debug_lab() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        if (!window.location.pathname.includes("/new/") /* land page pre-release */
            && ( !(pathElements.includes("lab") || pathElements.includes("lab-challenge") || pathElements.includes("lab-assessment"))
                 || pathElements.length > 2 /* lab step */) ) {
            return;
        }

        const url = new URL(window.location.href);
        if (!url.searchParams.get('debug_mode')) {
            url.searchParams.set('debug_mode', true);
            window.location.href = url.href;
        }
    }

})();