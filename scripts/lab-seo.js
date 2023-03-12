// ==UserScript==
// @name         Lab SEO
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Displays the SEO description
// @author       Andrew Burchill
// @grant        none
// @match        https://*.cloudacademy.com/*
// @match        https://*.app.qa.com/*
// @run-at       document-start
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-seo.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-seo.js
// ==/UserScript==
(function() {
    'use strict';
    const page_title_selector = "[data-cy=gridRow] > [data-cy=GridCol] > [data-cy=box] > [data-cy=text]:not([letter-spacing])";
    const admin_link_selector = "#admin-link";
    waitForKeyElements(page_title_selector, labSeo);
    waitForKeyElements(admin_link_selector, labSeo);
    function labSeo() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        const view = (pathElements.length > 2 && !window.location.pathname.includes("/new/")) ? "labstep" : "lab";
        if (view == "lab") {
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
                        title_element.insertAdjacentHTML('beforeend', '<h6>' + seo + "</h6>");
                }
            }
        }
    }
})();