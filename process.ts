import { getPublicSuffix } from "tldts";

// The regex pattern for IP address validation
const ipRegex =
  /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g;

await Deno.mkdir("output", { recursive: true });

console.log("Processing IP address...");

const _ip = await Deno.readTextFile("./input/trustpositif-ip.txt");
const ip = _ip.match(ipRegex) || [];

const IPRuleSet = {
  version: 3,
  rules: [
    {
      ip_cidr: ip,
    },
  ],
};

console.log("Writing the IP rule-set...");

await Deno.writeTextFile(
  "./output/trustpositif-ip.json",
  JSON.stringify(IPRuleSet, null, 2),
);

console.log("Processing domain...");

const __domain = await Deno.readTextFile("./input/trustpositif-domain.txt");
const _domain = __domain.split("\n").map((line) => line.trim()).filter((line) =>
  line.length > 0
);

console.log("Parsing domain...");

const DomainRuleSet = {
  version: 3,
  rules: [
    {
      domain: [] as string[],
    },
  ],
};

for (const domain of _domain) {
  const parsed = getPublicSuffix(domain, { allowPrivateDomains: true });
  if (parsed === domain) {
    console.log(`Public Suffix detected! ${domain}`);
    continue;
  }
  DomainRuleSet.rules[0].domain.push(domain);
}

console.log("Writing the Domain rule-set...");

await Deno.writeTextFile(
  "./output/trustpositif-domain.json",
  JSON.stringify(DomainRuleSet, null, 2),
);
