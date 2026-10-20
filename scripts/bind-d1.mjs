import fs from 'fs';

const accountId = "b4ec1313de995b53fcf55729116c0205";
const databaseId = "3894eea3-f7c8-4c9b-a2e8-e75a651aa30c";

// Read token from ~/.wrangler/config/default.toml
const tomlContent = fs.readFileSync('C:\\Users\\samee\\.wrangler\\config\\default.toml', 'utf8');
const match = tomlContent.match(/oauth_token\s*=\s*"([^"]+)"/);
if (!match) {
  console.error("OAuth token not found");
  process.exit(1);
}
const token = match[1];

async function bindD1(projectName) {
  console.log(`Binding D1 to ${projectName}...`);
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deployment_configs: {
        production: {
          d1_databases: {
            DB: { id: databaseId }
          }
        },
        preview: {
          d1_databases: {
            DB: { id: databaseId }
          }
        }
      }
    })
  });

  const data = await res.json();
  console.log(`Result for ${projectName}:`, JSON.stringify(data.success ? "SUCCESS" : data.errors, null, 2));
}

await bindD1('answerindex-pro');
await bindD1('answerindex');
