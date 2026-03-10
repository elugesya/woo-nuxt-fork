// pi extension to override Anthropic provider with custom Z.AI proxy details

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("anthropic", {
    baseUrl: "https://api.z.ai/api/anthropic",
    apiKey: "bf11801dd9364c95b7a1fd7520fa41a8.sZX1jhCVL4mQM6EF",
    headers: { "x-api-key": "bf11801dd9364c95b7a1fd7520fa41a8.sZX1jhCVL4mQM6EF" },
    api: "anthropic-messages",
    // No custom streamSimple needed, compatible with Claude format
    // Models and pricing will use built-in unless specified
  });
}
