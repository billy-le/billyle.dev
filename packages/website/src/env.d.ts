/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_REMARK_URL: string;
	readonly PUBLIC_SITE: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
