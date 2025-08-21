const TRUSTPOSITIF_IP = "https://raw.githubusercontent.com/alsyundawy/mikrotik-blacklist/refs/heads/master/TrustPositifList.rsc"
const TRUSTPOSITIF_DOMAIN = "https://raw.githubusercontent.com/alsyundawy/TrustPositif/refs/heads/main/trusts.txt"

console.log("Downloading IP & domain database for TrustPositif...");

// Memory-efficient download using streaming
async function downloadFile(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.body) throw new Error("No response body");
  
  await Deno.mkdir("input", { recursive: true });
  const file = await Deno.open(outputPath, { write: true, create: true });
  
  try {
    for await (const chunk of response.body) {
      await file.write(chunk);
    }
    console.log(`✅ Saved: ${outputPath}`);
  } finally {
    file.close();
  }
}

// Download both files
await downloadFile(TRUSTPOSITIF_IP, "input/trustpositif-ip.txt");
await downloadFile(TRUSTPOSITIF_DOMAIN, "input/trustpositif-domain.txt");

console.log("🎉 Downloads completed!");
