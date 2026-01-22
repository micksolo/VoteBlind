/**
 * Process AustralianElectorates Localities.json into app-friendly format
 *
 * Run with: npx tsx scripts/processElectorateData.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawLocality {
  Place: string;
  Postcode: number;
  Electorate: string;
}

interface ProcessedLocality {
  suburb: string;
  electorate: string;
  state: string;
}

interface PostcodeLookup {
  localities: ProcessedLocality[];
  singleElectorate: boolean;
  electorate?: string;
  state?: string;
}

interface ProcessedData {
  [postcode: string]: PostcodeLookup;
}

// Australian postcode ranges by state/territory
function getState(postcode: number): string {
  // NSW
  if (postcode >= 1000 && postcode <= 1999) return 'NSW'; // PO Boxes Sydney
  if (postcode >= 2000 && postcode <= 2599) return 'NSW';
  if (postcode >= 2619 && postcode <= 2899) return 'NSW';
  if (postcode >= 2921 && postcode <= 2999) return 'NSW';

  // ACT
  if (postcode >= 2600 && postcode <= 2618) return 'ACT';
  if (postcode >= 2900 && postcode <= 2920) return 'ACT';

  // VIC
  if (postcode >= 3000 && postcode <= 3999) return 'VIC';
  if (postcode >= 8000 && postcode <= 8999) return 'VIC'; // PO Boxes

  // QLD
  if (postcode >= 4000 && postcode <= 4999) return 'QLD';
  if (postcode >= 9000 && postcode <= 9999) return 'QLD'; // PO Boxes

  // SA
  if (postcode >= 5000 && postcode <= 5799) return 'SA';
  if (postcode >= 5800 && postcode <= 5999) return 'SA'; // PO Boxes

  // WA
  if (postcode >= 6000 && postcode <= 6797) return 'WA';
  if (postcode >= 6800 && postcode <= 6999) return 'WA'; // PO Boxes

  // TAS
  if (postcode >= 7000 && postcode <= 7799) return 'TAS';
  if (postcode >= 7800 && postcode <= 7999) return 'TAS'; // PO Boxes

  // NT
  if (postcode >= 800 && postcode <= 899) return 'NT';
  if (postcode >= 900 && postcode <= 999) return 'NT'; // PO Boxes

  return 'Unknown';
}

async function processData() {
  console.log('Processing AustralianElectorates data...');

  // Read the downloaded file
  const rawData: RawLocality[] = JSON.parse(
    fs.readFileSync('/tmp/localities.json', 'utf-8')
  );

  console.log(`Read ${rawData.length} locality records`);

  const processed: ProcessedData = {};

  for (const locality of rawData) {
    const postcode = String(locality.Postcode).padStart(4, '0');
    const state = getState(locality.Postcode);

    // Normalize electorate name (convert to title case)
    const electorate = locality.Electorate
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (!processed[postcode]) {
      processed[postcode] = { localities: [], singleElectorate: true };
    }

    processed[postcode].localities.push({
      suburb: locality.Place,
      electorate,
      state,
    });
  }

  // Determine single-electorate postcodes and deduplicate
  let singleCount = 0;
  let multiCount = 0;

  for (const postcode of Object.keys(processed)) {
    const electorates = new Set(processed[postcode].localities.map(l => l.electorate));
    processed[postcode].singleElectorate = electorates.size === 1;

    if (electorates.size === 1) {
      processed[postcode].electorate = processed[postcode].localities[0].electorate;
      processed[postcode].state = processed[postcode].localities[0].state;
      singleCount++;
    } else {
      multiCount++;
    }

    // Sort localities alphabetically
    processed[postcode].localities.sort((a, b) => a.suburb.localeCompare(b.suburb));
  }

  console.log(`Processed ${Object.keys(processed).length} postcodes`);
  console.log(`  - ${singleCount} single-electorate postcodes`);
  console.log(`  - ${multiCount} multi-electorate postcodes`);

  // Write the output
  const outputPath = path.join(__dirname, '../src/data/electorates.json');
  fs.writeFileSync(outputPath, JSON.stringify(processed));

  const stats = fs.statSync(outputPath);
  console.log(`Output written to: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
}

processData().catch(console.error);
