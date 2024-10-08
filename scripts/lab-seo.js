// ==UserScript==
// @name         Lab SEO
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Displays the SEO description
// @author       Andrew Burchill
// @grant        none
// @match        https://*.cloudacademy.com/*
// @match        https://*.app.qa.com/*
// @match        https://*.platform.qa.com/*
// @run-at       document-start
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-seo.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-seo.js
// ==/UserScript==
(function() {
    'use strict';
    const page_title_selector = "h1[data-cy='heading']";
    const admin_link_selector = "#admin-link";
    const seo_id = "#seo-injection";
    waitForKeyElements(page_title_selector, labSeo);
    waitForKeyElements(admin_link_selector, labSeo);
    function labSeo() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        const view = (pathElements.length > 2 && !window.location.pathname.includes("/new/")) ? "labstep" : "lab";
        if (view == "lab") {
            if (document.querySelector(seo_id)) {
                return;
            }
            let nodes = document.querySelectorAll('meta[Name="description"]');
            var seo = "No SEO";
            if (nodes.length > 0) {
                for (var node of nodes) {
                    var content = node.getAttribute("content");
                    if (content == "Accelerate progress up the cloud curve with Cloud Academy's digital training solutions. Build a culture of cloud with technology and guided learning experiences.") {
                        continue;
                    }
                    seo = content;
                }
                const title_element = document.querySelector(page_title_selector);
                if (title_element) {
                    title_element.insertAdjacentHTML('beforeend', `<h6 id="${seo_id}">${seo}</h6>`);
                }
            }
        }
    }
})();