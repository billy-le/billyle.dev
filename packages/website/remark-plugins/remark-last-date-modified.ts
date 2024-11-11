import { execSync } from "node:child_process";
import type { RemarkPlugins } from "astro";

export const remarkLastDateModified: RemarkPlugins[number] = function () {
	return async function (_, file) {
		const filepath = file.history[0];
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
		// @ts-ignore
		file.data.astro.frontmatter.lastDateModified = result.toString();
	};
};
