// ==UserScript==
// @name         Lab Hagrid environment failure enrichment
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Displays links to admin from hagrid
// @author       Logan Rakai
// @grant        none
// @match        https://hagrid.production.svc.cloudacademy.xyz/admin/environments/environmentfailure/*
// @match        https://hagrid.production.svc.cloudacademy.xyz/admin/tasks/vcffailure/*
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
                const targetElement = element;
                set_new_children(element, targetElement, () => {
                    element.textContent = "";
                });
            });
        } else if (view == "failure") {
            const element = document.querySelector('.readonly a')
            const targetElement = element.parentElement;
            set_new_children(element, targetElement, () => {
                targetElement.removeChild(element);
            });
        }
    }
    function set_new_children(element, targetElement, initTarget) {
        const text = element.innerText;
        if (text.length < 3) {
            return;
        }
        initTarget();
        const env_id = text.split(" ")[2];
        const platform_admin_link = create_admin_link_element('platform', env_id, text);
        const app_admin_link = create_admin_link_element('app', env_id, '(app.qa)', "margin-left: 5px;");
        targetElement.appendChild(platform_admin_link);
        targetElement.appendChild(app_admin_link);
    }
    function create_admin_link_element(subdomain, env_id, text, style) {
        const admin_link = document.createElement("a");
        set_link_tags(admin_link, subdomain, env_id);
        admin_link.innerText = text;
        if (style) {
            admin_link.style = style;
        }
        return admin_link;
    }
    function set_link_tags(element, subdomain, env_id) {
        element.href = `https://${subdomain}.qa.com/admin/clouda/laboratories/labsession/?environment_session_id=${env_id}`;
        element.target = "_blank";
    }
})();