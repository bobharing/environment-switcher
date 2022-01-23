import { siteEnvironmentMapping } from "../data/siteEnvironmentMapping.js";

// Returns either: tst, acc or prd
export function getEnvironment(url) {
	if (!url) {
		return null;
	}

	const matchSiteMappingName = getSite(url);

	const environmentMapping = siteEnvironmentMapping?.[matchSiteMappingName];

	if (!environmentMapping) {
		return null;
	}

	return Object.keys(environmentMapping).find(key => url.indexOf(environmentMapping[key]) !== -1);
}

export function isActive(url) {
	return getEnvironment(url) && getSite(url);
}

export function getPath(url) {
	// Long John da MVP
	const parser = document.createElement("a");
	parser.href = url;

	return parser.pathname + parser.search + parser.hash;
}

// Returns the site in the following format (ncoi-nl)
export function getSite(url) {
	const environmentUrls = Object.keys(siteEnvironmentMapping);

	let site = environmentUrls.find(siteItem => {
		return url.indexOf(siteItem) !== -1;
	});

	if (!site) {
		site = environmentUrls.find(domain => {
			return url.indexOf(domain.replace("-", ".")) !== -1;
		});
	}
	return site;
}
