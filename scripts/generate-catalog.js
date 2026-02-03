
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = path.join(__dirname, '../public/artifacts');
const OUTPUT_FILE = path.join(__dirname, '../public/catalog.json');

// Configuration
const REQUIRED_FIELDS = ['title', 'function', 'description', 'createdAt'];

function scanDirectory(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanDirectory(filePath, fileList);
        } else if (file === 'meta.json') {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function generateCatalog() {
    console.log('🔍 Scanning for artifacts...');

    if (!fs.existsSync(ARTIFACTS_DIR)) {
        console.warn('⚠️ No artifacts directory found at public/artifacts');
        fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
        console.log('✅ Created public/artifacts directory');
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
        return;
    }

    const metaFiles = scanDirectory(ARTIFACTS_DIR);
    const catalog = [];
    const errors = [];

    metaFiles.forEach(metaPath => {
        try {
            const content = fs.readFileSync(metaPath, 'utf8');
            const meta = JSON.parse(content);
            const dirPath = path.dirname(metaPath);

            // Validation
            const missingFields = REQUIRED_FIELDS.filter(field => !meta[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Calculate paths
            const relativeDir = path.relative(ARTIFACTS_DIR, dirPath);
            // normalized path for web (forward slashes)
            const id = relativeDir.split(path.sep).join('/');

            // Check for index.html
            const indexPath = path.join(dirPath, 'index.html');
            if (!fs.existsSync(indexPath)) {
                throw new Error('Missing index.html');
            }

            catalog.push({
                ...meta,
                id,
                path: `/artifacts/${id}/index.html`
            });

        } catch (err) {
            const shortPath = path.relative(process.cwd(), metaPath);
            errors.push(`${shortPath}: ${err.message}`);
        }
    });

    // Sort by createdAt desc
    catalog.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Write catalog
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2));

    console.log(`✅ Generated catalog with ${catalog.length} artifacts.`);

    if (errors.length > 0) {
        console.error('\n⚠️ Errors found:');
        errors.forEach(e => console.error(`  - ${e}`));
        process.exit(1);
    }
}

generateCatalog();
