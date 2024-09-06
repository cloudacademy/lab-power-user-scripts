// ==UserScript==
// @name         Lab Hagrid environment failure enrichment
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displays links to admin from hagrid
// @author       Logan Rakai
// @grant        none
// @match        https://hagrid.production.svc.cloudacademy.xyz/admin/environments/environmentfailure/*
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/hagrid-environment-failures.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/hagrid-environment-failures.js
// ==/UserScript==
(function() {
    'use strict';
    const main_selector = "#main";
    waitForKeyElements(main_selector, hagridEnrichment);
    function hagridEnrichment() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        const view = (pathElements.length > 2 && !window.location.pathname.includes("/change")) ? "failures" : "failure";
        if (view == "failures") {
            document.querySelectorAll('.field-session').forEach(element => {
                const env_id = element.innerText.split(" ")[2];
                const admin_link = create_admin_link_element(env_id);
                element.parentNode.insertBefore(admin_link, element);
                admin_link.appendChild(element);
            });
        } else if (view == "failure") {
            const element = document.querySelector('.readonly a')
            const env_id = element.innerText.split(" ")[2];
            element.href = `https://platform.qa.com/admin/clouda/laboratories/labsession/?environment_session_id=${env_id}`;
            element.target = "_blank";
        }
    }
    function create_admin_link_element(env_id) {
        const admin_link = document.createElement("a");
        admin_link.href = `https://platform.qa.com/admin/clouda/laboratories/labsession/?environment_session_id=${env_id}`;
        admin_link.target = "_blank";
        return admin_link;
    }
})();