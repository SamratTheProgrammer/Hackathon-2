const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Manually load .env if present
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"|"$/g, '');
            process.env[key] = value;
            if (key === 'DATABASE_URL') {
                console.log('Found DATABASE_URL:', value.substring(0, 20) + '...');
            }
        }
    });
} else {
    console.error('.env file not found!');
}

try {
    console.log('Running prisma generate...');
    // Use npx prisma via shell
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: { ...process.env },
        cwd: path.join(__dirname, '..')
    });

    console.log('Running prisma db push...');
    execSync('npx prisma db push', {
        stdio: 'inherit',
        env: { ...process.env },
        cwd: path.join(__dirname, '..')
    });

    console.log('Setup complete!');
} catch (error) {
    console.error('Command failed:', error.message);
    process.exit(1);

}
