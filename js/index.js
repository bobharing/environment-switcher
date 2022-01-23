import { getSite, getPath, getEnvironment } from "./matchUrls.js";
import { getEnvironmentUrls } from "./environmentUrls.js";

// Obtain current tab info
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	const targetDiv = document.querySelector("#js-page-url");
	const activeTabUrl = tabs[0]?.url;

	const siteEnvMapping = getEnvironmentUrls(getSite(activeTabUrl));

	if (!siteEnvMapping) {
		return;
	}

	const currentEnvironment = getEnvironment(activeTabUrl);

	// We want to work with an array of environments (set the order, exclude items, etc)
	const environmentArr = Object.keys(siteEnvMapping);

	const filteredEnvArr = environmentArr.filter(env => {
		return env !== currentEnvironment;
	});

	// Keep prefixes (www- | www. | cms-v12- | api-v12-)
	const parser = document.createElement("a");
	parser.href = activeTabUrl;
	let prefix = parser.host.slice(0, -siteEnvMapping[currentEnvironment].length);

	for (const env of filteredEnvArr) {
		// www. and www- need to be interchanged
		if (env === "prd") {
			prefix = prefix.replace("-", ".");
		} else if (currentEnvironment === "prd") {
			prefix = prefix.replace(".", "-");
		}

		const button = createEnvironmentButton(env);
		const path = getPath(activeTabUrl);
		const buttonUrl = `https://${prefix}${siteEnvMapping[env]}${path}`;

		setButtonEvent(button, buttonUrl, tabs[0].id);

		targetDiv.appendChild(button);
	}
});

const createEnvironmentButton = env => {
	const btnWrapper = document.createElement("div");
	btnWrapper.classList.add("c-button-environment");

	const btn = document.createElement("button");
	btn.classList.add("c-button");
	btn.insertAdjacentText("beforeend", env);

	btnWrapper.appendChild(btn);

	return btnWrapper;
};

// Setup event for environment button click + sendmessage to content script to navigate to url
const setButtonEvent = (button, buttonurl, tabId) => {
	button.addEventListener("click", event => {
		event.preventDefault();

		// Handle ctrl + click
		if (event.ctrlKey) {
			window.open(buttonurl, "_blank");
			window.close();
			return;
		}

		chrome.tabs.sendMessage(tabId, {
			url: buttonurl,
		});

		window.close();
	});
};
