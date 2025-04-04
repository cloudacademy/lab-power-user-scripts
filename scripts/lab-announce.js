// ==UserScript==
// @name         Announce Lab
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Facilitate creating posts by generating title, providing link, and body text
// @author       You
// @match        https://*.cloudacademy.com/*
// @match        https://*.platform.qa.com/*
// @grant        GM_setClipboard
// @grant        window.focus
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-announce.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/lab-announce.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    
    const announce_icon_html = `<span aria-label="Confluence" role="img" class="css-12mte9y" style="--logo-color: #2684FF; --logo-fill: var(--ds-text, #253858);">
        <svg viewBox="0 0 158 32" height="20" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <defs>
            <linearGradient x1="99.140087%" y1="112.745465%" x2="33.8589812%" y2="37.7675389%" id="uid25-1">
                <stop stop-color="#0052CC" offset="0%"></stop>
                <stop stop-color="#2684FF" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="14.1838118%" y1="5.80047897%" x2="61.141783%" y2="70.9663868%" id="uid25-2">
                <stop stop-color="#0052CC" offset="0%"></stop>
                <stop stop-color="#2684FF" offset="100%"></stop>
            </linearGradient>
            </defs>
            <g stroke="none" stroke-width="1" fill-rule="nonzero">
            <path fill="var(--ds-text, #253858)" fill-rule="evenodd" d="M45.312,20.984 C44.064,21.608 42.66,22.024 40.866,22.024 C36.81,22.024 34.34,19.424 34.34,15.498 C34.34,11.572 36.732,8.92 40.736,8.92 C42.712,8.92 44.064,9.336 45.286,10.116 L45.286,7.854 C44.064,6.97 42.4,6.658 40.736,6.658 C35.172,6.658 32,10.298 32,15.498 C32,20.88 35.172,24.26 40.788,24.26 C42.556,24.26 44.246,23.948 45.312,23.246 L45.312,20.984 Z M53.918,24.26 C50.018,24.26 47.73,21.374 47.73,17.474 C47.73,13.574 50.018,10.74 53.918,10.74 C57.792,10.74 60.054,13.574 60.054,17.474 C60.054,21.374 57.792,24.26 53.918,24.26 Z M53.918,12.82 C51.136,12.82 49.914,15.004 49.914,17.474 C49.914,19.944 51.136,22.18 53.918,22.18 C56.674,22.18 57.87,19.944 57.87,17.474 C57.87,15.004 56.674,12.82 53.918,12.82 Z M73.704,16.382 C73.704,12.794 71.988,10.74 68.998,10.74 C67.256,10.74 65.722,11.598 64.89,13.132 L64.89,11 L62.654,11 L62.654,24 L64.89,24 L64.89,16.772 C64.89,14.146 66.32,12.768 68.4,12.768 C70.532,12.768 71.468,13.808 71.468,16.148 L71.468,24 L73.704,24 L73.704,16.382 Z M79.918,9.622 C79.918,8.452 80.594,7.646 81.972,7.646 C82.492,7.646 82.986,7.698 83.376,7.776 L83.376,5.722 C82.986,5.618 82.544,5.514 81.868,5.514 C79.086,5.514 77.734,7.152 77.734,9.57 L77.734,11 L75.628,11 L75.628,13.08 L77.734,13.08 L77.734,24 L79.918,24 L79.918,13.08 L83.272,13.08 L83.272,11 L79.918,11 L79.918,9.622 Z M90.318,23.974 L90.318,21.972 C90.058,21.998 89.902,21.998 89.668,21.998 C88.706,21.998 87.926,21.582 87.926,20.412 L87.926,5.566 L85.69,5.566 L85.69,20.672 C85.69,23.064 87.042,24.078 89.174,24.078 C89.746,24.078 90.136,24.026 90.318,23.974 Z M92.216,18.618 C92.216,22.206 93.932,24.26 96.922,24.26 C98.664,24.26 100.198,23.402 101.03,21.868 L101.03,24 L103.266,24 L103.266,11 L101.03,11 L101.03,18.228 C101.03,20.854 99.6,22.232 97.52,22.232 C95.388,22.232 94.452,21.192 94.452,18.852 L94.452,11 L92.216,11 L92.216,18.618 Z M116.89,23.48 C115.824,24.052 114.186,24.26 112.86,24.26 C107.998,24.26 105.866,21.452 105.866,17.474 C105.866,13.548 108.05,10.74 112.002,10.74 C116.006,10.74 117.618,13.522 117.618,17.474 L117.618,18.488 L108.128,18.488 C108.44,20.698 109.87,22.128 112.938,22.128 C114.446,22.128 115.72,21.842 116.89,21.426 L116.89,23.48 Z M111.898,12.768 C109.532,12.768 108.336,14.302 108.102,16.564 L115.356,16.564 C115.226,14.146 114.134,12.768 111.898,12.768 Z M131.32,16.382 C131.32,12.794 129.604,10.74 126.614,10.74 C124.872,10.74 123.338,11.598 122.506,13.132 L122.506,11 L120.27,11 L120.27,24 L122.506,24 L122.506,16.772 C122.506,14.146 123.936,12.768 126.016,12.768 C128.148,12.768 129.084,13.808 129.084,16.148 L129.084,24 L131.32,24 L131.32,16.382 Z M143.618,21.66 C142.812,21.946 141.98,22.128 140.654,22.128 C137.248,22.128 135.844,19.996 135.844,17.474 C135.844,14.952 137.222,12.82 140.602,12.82 C141.824,12.82 142.708,13.054 143.54,13.444 L143.54,11.364 C142.526,10.896 141.616,10.74 140.446,10.74 C135.818,10.74 133.66,13.548 133.66,17.474 C133.66,21.452 135.818,24.26 140.446,24.26 C141.642,24.26 142.838,24.078 143.618,23.662 L143.618,21.66 Z M156.41,23.48 C155.344,24.052 153.706,24.26 152.38,24.26 C147.518,24.26 145.386,21.452 145.386,17.474 C145.386,13.548 147.57,10.74 151.522,10.74 C155.526,10.74 157.138,13.522 157.138,17.474 L157.138,18.488 L147.648,18.488 C147.96,20.698 149.39,22.128 152.458,22.128 C153.966,22.128 155.24,21.842 156.41,21.426 L156.41,23.48 Z M151.418,12.768 C149.052,12.768 147.856,14.302 147.622,16.564 L154.876,16.564 C154.746,14.146 153.654,12.768 151.418,12.768 Z"></path>
            <path fill="url(#uid25-1)" d="M0.85465057,21.7022581 C0.61090057,22.0783871 0.33715057,22.5148387 0.10465057,22.8625806 C-0.10345498,23.195346 0.00826440879,23.6245091 0.35590057,23.8277419 L5.23090057,26.6664516 C5.40202309,26.7664253 5.60840847,26.7971801 5.80372052,26.7518112 C5.99903257,26.7064423 6.16690583,26.5887513 6.26965057,26.4251613 C6.46465057,26.1164516 6.71590057,25.7154839 6.98965057,25.286129 C8.92090057,22.27 10.8634006,22.6390323 14.3659006,24.2216129 L19.1996506,26.3967742 C19.3827218,26.4792261 19.5932727,26.4880304 19.7833166,26.4211804 C19.9733605,26.3543303 20.1267047,26.2175221 20.2084006,26.0419355 L22.5296506,21.0741935 C22.6936507,20.7193919 22.5267777,20.3056906 22.1546506,20.1445161 C21.1346506,19.6903226 19.1059006,18.7854839 17.2796506,17.9516129 C10.7096506,14.9354839 5.12590057,15.1341935 0.85465057,21.7022581 Z"></path>
            <path fill="url(#uid25-2)" d="M22.7130274,10.4325806 C22.9567774,10.0564516 23.2305274,9.62 23.4630274,9.27225806 C23.6711329,8.93949274 23.5594135,8.51032964 23.2117774,8.30709677 L18.3367774,5.4683871 C18.1633186,5.35902032 17.9495842,5.32289142 17.7468362,5.36866556 C17.5440883,5.4144397 17.3706168,5.53798759 17.2680274,5.70967742 C17.0730274,6.0183871 16.8217774,6.41935484 16.5480274,6.84870968 C14.6167774,9.86483871 12.6742774,9.49580645 9.17177736,7.91322581 L4.35302736,5.7416129 C4.16995613,5.65916098 3.95940527,5.65035674 3.76936133,5.71720675 C3.5793174,5.78405675 3.42597321,5.92086501 3.34427736,6.09645161 L1.02302736,11.0641935 C0.85902727,11.4189952 1.02590019,11.8326965 1.39802736,11.993871 C2.41802736,12.4480645 4.44677736,13.3529032 6.27302736,14.1867742 C12.8580274,17.1993548 18.4417774,17.0006452 22.7130274,10.4325806 Z"></path>
            </g>
        </svg></span>`;
    const announce_link_target_selector = "[data-cy=\"GridCol\"] [data-cy=\"box\"] > div > span[data-cy=\"text\"]";
    const page_title_selector = "h1[data-cy='heading']";
    const lab_description_selector = "div[data-cy=\"tabs\"] div[data-cy=\"GridCol\"] > div > span[data-cy=\"text\"]";
    const announce_id = "announce-lab";
    const announce_selector = `#${announce_id}`;
    const announce_url = "https://workforce-learning.atlassian.net/wiki/create-content/blog?spaceKey=CT&source=spaceLevelBlogContextualCreate";
    const link_style = "color:#00ffc6;font-size:12px";
    let announce_clicked = false;

    waitForKeyElements(page_title_selector, announce_lab);
    window.addEventListener('load', announce_lab, false);

    function announce_lab() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        if (!(pathElements.includes("lab") || pathElements.includes("lab-challenge") || pathElements.includes("lab-assessment"))
            || (pathElements.length > 2 && !window.location.pathname.includes("/new/"))) {
            return;
        }

        const title_element = document.querySelector(page_title_selector);
        if (!title_element) {
            return;
        }
        const link = location.href.replace(location.search, '');

        let title, body_intro;
        if(pathElements.includes("lab-challenge")) {
            title = `${date_string()} New Lab Challenge: ${get_title(title_element)}`;
            body_intro = 'A new lab challenge has been published.'
        } else if(pathElements.includes("lab-assessment")) {
            title = `${date_string()} New Lab Assessment: ${get_title(title_element)}`;
            body_intro = 'A new lab asssessment has been published.'
        } else {
            title = `${date_string()} New Lab: ${get_title(title_element)}`;
            body_intro = 'A new lab has been published.'
        }
        const lab_description_element = document.querySelector(lab_description_selector);
        const announce_link_target_element = document.querySelector(announce_link_target_selector);
        if (!announce_link_target_element || announce_link_target_element.parentElement.querySelector(announce_selector)) {
            return;
        }
        const lab_description_html = lab_description_element.innerHTML;
        const formatted_lab_description_html = lab_description_html.replace(/<p>/g, '').replace(/<\/p>/g, '<br />').replace(/<h3>/g, '<strong>').replace(/<\/h3>/g, '</strong>').replace(/<br\s*\/?>\s*<ul>/g, '<ul>')
        const body = `${body_intro}<br />
${link}<br />
${formatted_lab_description_html}
<strong>Reason for content build</strong>:&nbsp;
`;
        announce_link_target_element.insertAdjacentHTML('afterEnd', `<span id=${announce_id} style="padding-left: 5px;">${announce_icon_html}</span>`);
        const announce_element = announce_link_target_element.parentElement.querySelector(announce_selector);
        announce_element.onclick = function() { copy_title(announce_element, title, body); };
    }

    function copy_title(element, title, body) {
        window.focus();
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                window.focus();
                navigator.clipboard.writeText(title).then(
                    function () {
                        console.log("Successfully wrote title to clipboard.");
                    },
                    function (error) {
                        console.log(error);
                        console.log("Failed to write title to clipboard.");
                    }
                );
                if (!announce_clicked) {
                    announce_clicked = true;
                    window.open(announce_url, "_blank");
                }
            }
        });
        if (!announce_clicked) {
            element.insertAdjacentHTML('AfterEnd', `<span style="padding-left: 5px; font-size: 14px; color: navy; text-decoration: underline;">Copy announcement body</span>`);
            element.nextElementSibling.onclick = function() { copy_announce_body(title, body) };
        }
    }

    function copy_announce_body(title, body) {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                const type = "text/html";
                const blob = new Blob([body], { type });
                const data = [new ClipboardItem({ [type]: blob })];
                navigator.clipboard.write(data).then(
                    function () {
                        console.log("Successfully wrote body to clipboard.");
                    },
                    function (error) {
                        console.log(error);
                        console.log("Failed to write body to clipboard.");
                    }
                );
            }
        });
    }

    function get_title(title_element) {
        return Array.from(title_element.childNodes)
            .filter(node => node.nodeName !== 'H6')
            .map(node => node.textContent.trim())
    }

    function date_string() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const now = new Date();
        const utcMonth = monthNames[now.getUTCMonth()];
        const utcYear = now.getUTCFullYear();
        return `${utcMonth} ${utcYear}`;
    }
})();