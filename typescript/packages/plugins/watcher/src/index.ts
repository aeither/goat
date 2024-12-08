import type { Plugin } from "@goat-sdk/core";
import { getTools } from "./tools";

export function watcher(credentials: {
	apiKey: string;
}): Plugin<any> {
	return {
		name: "watcher",
		supportsChain: () => true,
		supportsSmartWallets: () => true,
		getTools: async () => {
			return getTools({
				apiKey: credentials.apiKey,
			});
		},
	};
}
