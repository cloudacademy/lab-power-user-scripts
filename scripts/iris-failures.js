// ==UserScript==
// @name         Iris failure enrichment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enrich iris failure view
// @author       Logan Rakai
// @grant        none
// @match        https://iris.production.svc.cloudacademy.xyz/admin/failure/list*
// @match        https://iris.production.svc.cloudacademy.xyz/admin/failure/details/*
// @grant        GM_setClipboard
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/iris-failures.js
// @updateURL    https://raw.githubusercontent.com/cloudacademy/lab-power-user-scripts/main/scripts/iris-failures.js
// ==/UserScript==
(function() {
    'use strict';
    const main_selector = "table.table";
    waitForKeyElements(main_selector, irisEnrichment);
    function irisEnrichment() {
        const pathElements = window.location.pathname.split('/').filter(e => e);
        const view = (pathElements.length > 2 && window.location.pathname.includes("list")) ? "failures" : "failure";
        pathElements.in
        if (view == "failures") {
            document.querySelectorAll('tbody > tr').forEach(rowElement => {
                const sessionElement = rowElement.querySelector('td:nth-child(6)');
                let targetElement = sessionElement;
                set_new_children(sessionElement, targetElement, 'session', () => {
                    sessionElement.textContent = "";
                });

                const labElement = rowElement.querySelector('td:nth-child(7)');
                targetElement = labElement;
                set_new_children(labElement, targetElement, 'lab', () => {
                    labElement.textContent = "";
                });

                const vcfElement = rowElement.querySelector('td:nth-child(8)');
                targetElement = vcfElement;
                set_new_children(vcfElement, targetElement, 'vcf', () => {
                    vcfElement.textContent = "";
                });
            });
        } else if (view == "failure") {
            document.querySelectorAll('tbody').forEach(rowElement => {
                const sessionElement = rowElement.querySelector('tr:nth-child(7) > td:nth-child(2)');
                let targetElement = sessionElement;
                set_new_children(sessionElement, targetElement, 'session', () => {
                    sessionElement.textContent = "";
                });

                const labElement = rowElement.querySelector('tr:nth-child(10) > td:nth-child(2)');
                targetElement = labElement;
                set_new_children(labElement, targetElement, 'lab', () => {
                    labElement.textContent = "";
                });

                const vcfElement = rowElement.querySelector('tr:nth-child(11) > td:nth-child(2)');
                targetElement = vcfElement;
                set_new_children(vcfElement, targetElement, 'vcf', () => {
                    vcfElement.textContent = "";
                });

                const labIdElement = rowElement.querySelector('tr:nth-child(18) > td:nth-child(2)');
                targetElement = labIdElement;
                set_new_children(labIdElement, targetElement, 'labid', () => {
                    labIdElement.textContent = "";
                });
            });

            const headingRowElements = document.querySelectorAll("tbody > tr");
            const matchingElements = Array.from(headingRowElements).filter((element) =>
                element.children[0].innerText.startsWith("reason") ||
                element.children[0].innerText.startsWith("vendor_log")
            );
            matchingElements.forEach((element) => {
                insert_copy_button(element.children[0]);
            });
        }
    }
    function set_new_children(element, targetElement, childType, initTarget) {
        const parameter = element.innerText;
        if (parameter.length < 3) {
            return;
        }
        initTarget();
        const platform_admin_link = create_admin_link_element('platform', childType, parameter, parameter);
        const app_admin_link = create_admin_link_element('app', childType, parameter, '(app.qa)', "margin-left: 5px;");
        targetElement.appendChild(platform_admin_link);
        targetElement.appendChild(app_admin_link);
    }
    function create_admin_link_element(subdomain, childType, parameter, text, style) {
        const admin_link = document.createElement("a");
        set_link_tags(admin_link, childType, subdomain, parameter);
        admin_link.innerText = text;
        if (style) {
            admin_link.style = style;
        }
        return admin_link;
    }
    function set_link_tags(element, childType, subdomain, parameter) {
        if (childType == 'session') {
            element.href = `https://${subdomain}.qa.com/admin/clouda/laboratories/labsession/?environment_session_id=${parameter}`;
        } else if (childType == 'lab') {
            element.href = `https://${subdomain}.qa.com/admin/clouda/laboratories/laboratory/?title=${parameter}`;
        } else if (childType == 'labid') {
            element.href = `https://${subdomain}.qa.com/admin/clouda/laboratories/laboratory/${parameter}/change/`;
        } else if (childType == 'vcf') {
            element.href = `https://${subdomain}.qa.com/admin/clouda/laboratories/validationcheckfunction/?title=${parameter}`;
        }
        element.target = "_blank";
    }
    function insert_copy_button(element) {
        const copyButton = document.createElement("span");
        copyButton.innerText = "Copy";
        copyButton.style = "margin-left: 5px; background-color: #307fdd; color: white; padding: 6px; border-radius: 13px;";
        copyButton.onclick = function () {
            window.focus();
            navigator.permissions.query({ name: "clipboard-write" })
                .then((result) => {
                    if (result.state == "granted" || result.state == "prompt") {
                        window.focus();
                        navigator.clipboard.writeText(element.nextElementSibling.innerText)
                            .then(
                                function () {
                                    console.log("Successfully wrote to clipboard.");
                                    copyButton.innerText = "Copied!";
                                },
                                function (error) {
                                    console.log(error);
                                    console.log("Failed to write clipboard.");
                                }
                            );
                    } else {
                        console.log("Clipboard permissions denied.");
                    }
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        };
        element.appendChild(copyButton);
    }
})();
