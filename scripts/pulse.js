// ==UserScript==
// @name         Pulse Lab
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Facilitate creating pulse post by generating title, providing link, and body text
// @author       You
// @match        https://*.cloudacademy.com/*
// @grant        GM_setClipboard
// @grant        window.focus
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/pulse.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/pulse.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const pulse_icon_html = '<svg width="50px" height="12.5px" viewBox="0 0 100 25" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 0C5.6 0 0 5.6 0 12.5S5.6 25 12.5 25 25 19.4 25 12.5 19.4 0 12.5 0zm0 22.5c-5.525 0-10-4.475-10-10s4.475-10 10-10 10 4.475 10 10-4.475 10-10 10zm6.25-10a6.25 6.25 0 11-12.5 0 6.25 6.25 0 0112.5 0z" fill="#000000"></path><path d="M33.75 19.793h2.954v-4.731h2.484c3.213 0 5.083-2.003 5.083-4.917 0-2.9-1.836-4.945-5.008-4.945H33.75v14.593zm2.954-7.204V7.722h1.992c1.706 0 2.532.97 2.532 2.423 0 1.446-.826 2.444-2.518 2.444h-2.006zM56.536 5.2v9.213c0 1.668-1.12 2.872-2.839 2.872-1.712 0-2.838-1.204-2.838-2.872V5.2h-2.954v9.477c0 3.192 2.306 5.323 5.792 5.323 3.473 0 5.793-2.13 5.793-5.323V5.2h-2.954zM63.636 19.793h7.254l1.69-2.544h-5.99V5.2h-2.954v14.594zM83.832 9.397h2.832C86.623 6.796 84.576 5 81.464 5c-3.063 0-5.307 1.767-5.293 4.418-.007 2.152 1.446 3.385 3.806 3.976l1.522.4c1.522.384 2.368.84 2.374 1.824-.007 1.068-.975 1.795-2.476 1.795-1.535 0-2.64-.74-2.736-2.202h-2.859C75.877 18.368 78.04 20 81.431 20c3.411 0 5.417-1.703 5.424-4.375-.007-2.43-1.76-3.72-4.19-4.29l-1.255-.314c-1.214-.292-2.23-.762-2.21-1.81 0-.94.798-1.631 2.244-1.631 1.413 0 2.28.67 2.388 1.817zM90.557 19.793H100V17.25h-6.488v-3.484h4.738V11.22h-4.738V7.743h4.738L99.973 5.2h-9.416v14.593z" fill="#000000"></path></svg>';
    const pulse_link_target_selector = "[data-cy=gridRow] > [data-cy=GridCol] > [data-cy=box] > svg";
    const page_title_selector = "[data-cy=gridRow] > [data-cy=GridCol] > [data-cy=box] > [data-cy=text]:not([letter-spacing])";
    const challenge_icon_selector = "div[name='labContent'] > div[type='lab'] > div > span";
    const lab_description_selector = "[data-cy=GridCol] > [data-cy=gridRow] > [data-cy=GridCol] > [data-cy=text] > div";
    const challenge_description_selector = "div[name='entityDescription'] > div > div[type='lab'] > div:nth-child(2) > div";
    const pulse_id = "pulse-lab";
    const pulse_selector = `#${pulse_id}`;
    const pulse_url = "https://cloudacademy.pulse.so/streams/e64f63f6-a096-4cc6-9c35-e236b9b91b41/";
    const link_style = "color:#00ffc6;font-size:12px";
    let pulse_clicked = false;

    waitForKeyElements(page_title_selector, pulse_lab);
    window.addEventListener('load', pulse_lab, false);

    function pulse_lab() {
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

        if(pathElements.includes("lab-challengeas")) {
            const title = `New Lab Challenge: ${title_element.textContent}`;
            const challenge_icon_element = document.querySelector(challenge_icon_selector);
            if (!challenge_icon_element || challenge_icon_element.parentElement.querySelector(pulse_selector)) {
                return;
            }
            challenge_icon_element.insertAdjacentHTML('afterEnd', `<span id=${pulse_id} style="padding-left: 5px;">${pulse_icon_html}</span>`);
            const challenge_description_element = document.querySelector(challenge_description_selector);
            const overview_paragraph = challenge_description_element.querySelector('p:first-child').innerText;
            const learning_objectives_heading = Array.from(challenge_description_element.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll('h4')).find(el => el.textContent.toLowerCase() === 'what will be assessed');
            let sibling = learning_objectives_heading.nextElementSibling;
            let learning_objectives = "";
            while (sibling) {
                learning_objectives += sibling.outerHTML;
                sibling = sibling.nextElementSibling;
            }
            const body = `A new lab challenge has been published.<br />
${overview_paragraph}
${learning_objectives_heading.outerHTML}
${learning_objectives}
${link}
`;
            const pulse_element = challenge_icon_element.parentElement.querySelector(pulse_selector);
            pulse_element.onclick = function() { copy_title(pulse_element, title, body); };
        } else {
            const title = `New Lab: ${title_element.textContent}`;
            const lab_description_element = document.querySelector(lab_description_selector);
            const pulse_link_target_element = document.querySelector(pulse_link_target_selector);
            if (!pulse_link_target_element || pulse_link_target_element.parentElement.querySelector(pulse_selector)) {
                return;
            }
            const overview_paragraph = lab_description_element.querySelector('p:first-child').innerText;
            const learning_objectives_heading = Array.from(lab_description_element.querySelectorAll('h3')).find(el => el.textContent.toLowerCase() === 'learning objectives');
            let sibling = learning_objectives_heading.nextElementSibling;
            let learning_objectives = "";
            while (sibling.tagName !== "H3") {
                learning_objectives += sibling.outerHTML;
                sibling = sibling.nextElementSibling;
            }
            const body = `A new lab has been published.<br />
${overview_paragraph}
${learning_objectives_heading.outerHTML}
${learning_objectives}
${link}
`;
            pulse_link_target_element.insertAdjacentHTML('afterEnd', `<span id=${pulse_id} style="padding-left: 5px;">${pulse_icon_html}</span>`);
            const pulse_element = pulse_link_target_element.parentElement.querySelector(pulse_selector);
            pulse_element.onclick = function() { copy_title(pulse_element, title, body); };
        }
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
                if (!pulse_clicked) {
                    pulse_clicked = true;
                    window.open(pulse_url, "_blank");
                }
            }
        });
        if (!pulse_clicked) {
            element.insertAdjacentHTML('AfterEnd', `<span style="padding-left: 5px; font-size: 14px; color: navy; text-decoration: underline;">Copy pulse body</span>`);
            element.nextElementSibling.onclick = function() { copy_pulse_body(title, body) };
        }
    }

    function copy_pulse_body(title, body) {
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
})();