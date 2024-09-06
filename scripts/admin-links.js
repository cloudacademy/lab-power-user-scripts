// ==UserScript==
// @name         Admin link
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Provide links to open in admin
// @author       You
// @match        https://*.cloudacademy.com/*
// @match        https://*.app.qa.com/*
// @match        https://*.platform.qa.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/admin-links.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/admin-links.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // #lab-page-title for challenges, h1[data-cy='heading'] for assessments
    const breadcrumb_title_selector = "nav[type=lab] > ol > li:last-child,#lab-page-title,h1[data-cy='heading']"; 
    const page_title_selector = "h1[data-cy='heading']";
    const old_page_title_selector = "#lab-page-title";
    const challenge_step_selector = "h2";
    const maintenance_mode_selector = "[data-cy=Alert]";
    const old_ui_selector = "[name='undefinedContent']";
    const new_lab_step_title_selector = "[data-cy='flex-item'] > h2[data-cy='heading']";
    const validation_check_selector = "[data-cy=vcf-undefined-alert-title],[data-cy=vcf-passed-alert-title],[data-cy=vcf-failed-alert-title]";
    const admin_link_id = "admin-link";
    const admin_link_selector = `#${admin_link_id}`;
    const link_style = "color:005aff;font-size:12px;";
    const light_background_link_style = "color:#00c57d;font-size:12px;";
    const show_on_top_style = "position:relative;z-index:99999;";
    const schemed_domain = location.protocol + '//' + location.host;

    waitForKeyElements(breadcrumb_title_selector, adminLinks);
    waitForKeyElements(page_title_selector, adminLinks);
    waitForKeyElements(old_page_title_selector, adminLinks);
    waitForKeyElements(validation_check_selector, validationCheckAdminLinks);
    window.addEventListener('load', adminLinks, false);
    window.addEventListener('load', validationCheckAdminLinks, false);

    function adminLinks() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        if (!(pathElements.includes("lab") || pathElements.includes("lab-challenge") || pathElements.includes("lab-assessment"))) {
            return;
        }

        let title_element = document.querySelector(page_title_selector);
        if (!title_element || title_element.parentElement.querySelector(admin_link_selector)) {
            title_element = document.querySelector(old_page_title_selector);
            if (!title_element || title_element.parentElement.querySelector(admin_link_selector)) {
                return;
            }
        }
        const view = (pathElements.length > 2 && !window.location.pathname.includes("/new/")  && !window.location.pathname.includes("/your-results/")) ? "labstep" : "lab";
        const title_query = encodeURIComponent(title_element.textContent);
        let lab_admin_link = `${schemed_domain}/admin/clouda/laboratories/laboratory/?title=${title_query}`;
        let lab_sessions_link = `${schemed_domain}/admin/clouda/laboratories/labsession/?q=${title_query}`;
        let lab_preview_link = new URL(window.location);
        lab_preview_link.searchParams.append('preview', 'true');
        const in_preview = window.location.search.includes('preview=true') ? true : false;
        let lab_start_link = new URL(window.location);
        lab_start_link.searchParams.append('startLab', 'true');
        let lab_admin_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_admin_link}" target='_blank'>Admin</a>`;
        let lab_session_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_sessions_link}" target='_blank'>Sessions</a>`;
        let lab_preview_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_preview_link}" target='_self'>Preview</a>`;
        if (in_preview) {
            lab_preview_link.searchParams.delete('preview');
            lab_preview_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_preview_link}" target='_self'>Preview Off</a>`;
        }
        let lab_start_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_start_link}" target='_self'>Start</a>`;

        if(view === "lab") {
            if (Array.from(document.querySelectorAll(maintenance_mode_selector)).some((t) => t.textContent.includes("maintenance"))) {
                title_element.insertAdjacentHTML('afterEnd', `${lab_start_html}`);
            }
            title_element.insertAdjacentHTML('afterEnd', `${lab_admin_html}${lab_session_html}${lab_preview_html}`);
        } else {
            const breadcrumb_element = document.querySelector(breadcrumb_title_selector);
            if (breadcrumb_element?.querySelector(admin_link_selector) || title_element.querySelector(admin_link_selector)) {
                return;
            }

            const breadcrumb_title_query = encodeURIComponent(breadcrumb_element?.textContent);

            if(pathElements.includes("lab-challenge") || pathElements.includes("lab-assessment")) {
                // challenge lab steps have unique UI for titles
                const lab_step_title_element = document.querySelector(challenge_step_selector);
                const lab_step_title_query = encodeURIComponent(lab_step_title_element.textContent);
                const lab_step_admin_link = `${schemed_domain}/admin/clouda/laboratories/labstep/?title=${lab_step_title_query}`;
                lab_step_title_element.insertAdjacentHTML('beforeEnd', `&nbsp;<a id="${admin_link_id}" style='${light_background_link_style}' href="${lab_step_admin_link}" target='_blank'>Admin</a>`);
            }
            lab_admin_link = `${schemed_domain}/admin/clouda/laboratories/laboratory/?title=${breadcrumb_title_query}`;
            lab_sessions_link = `${schemed_domain}/admin/clouda/laboratories/labsession/?q=${breadcrumb_title_query}`;
            lab_admin_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_admin_link}" target='_blank'>Admin</a>`;
            lab_session_html = `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_sessions_link}" target='_blank'>Sessions</a>`;
            breadcrumb_element.insertAdjacentHTML('afterEnd', `${lab_admin_html}${lab_session_html}${lab_preview_html}`);
            if(!pathElements.includes("lab-challenge") && !pathElements.includes("lab-assessment")) {
                if (!document.querySelector(old_ui_selector)) {
                    document.querySelectorAll(new_lab_step_title_selector).forEach(e => {
                        const title_query = encodeURIComponent(e.textContent);
                        const lab_step_admin_link = `${schemed_domain}/admin/clouda/laboratories/labstep/?title=${title_query}`;
                        e.insertAdjacentHTML('afterEnd', `&nbsp;<a id="${admin_link_id}" style='${link_style}${show_on_top_style}' href="${lab_step_admin_link}" target='_blank'>Admin</a>`);
                    })
                } else {
                    const lab_step_admin_link = `${schemed_domain}/admin/clouda/laboratories/labstep/?title=${title_query}`;
                    title_element.insertAdjacentHTML('afterEnd', `&nbsp;<a id="${admin_link_id}" style='${link_style}' href="${lab_step_admin_link}" target='_blank'>Admin</a>`);
                }
            }
        }
    }

    function validationCheckAdminLinks() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        if (!(pathElements.includes("lab") || pathElements.includes("lab-challenge") || pathElements.includes("lab-assessment"))) {
            return;
        }
        const validation_check_titles = document.querySelectorAll(validation_check_selector);
        if (validation_check_titles.length == 0 || validation_check_titles[0].children.length > 0) {
            return;
        }

        validation_check_titles.forEach(element => {
            const query = encodeURIComponent(element.textContent.trimEnd());
            const check_admin_link = `${schemed_domain}/admin/clouda/laboratories/validationcheckfunction/?title=${query}`;
            element.insertAdjacentHTML('beforeEnd', `&nbsp;<a id="${admin_link_id}" style='${light_background_link_style}' href="${check_admin_link}" target='_blank'>Admin</a>`);
        });
    }

})();