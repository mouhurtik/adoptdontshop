#!/usr/bin/env node
/**
 * AdoptDontShop Android Build Script
 * 
 * Syncs the Capacitor project and optionally opens Android Studio.
 * 
 * Usage:
 *   node scripts/build-android.cjs              # Sync only
 *   node scripts/build-android.cjs --open       # Sync + open Android Studio
 *   node scripts/build-android.cjs --clean      # Clean + sync
 */

const { execSync } = require('child_process');

// Parse args
const args = process.argv.slice(2);
const shouldOpen = args.includes('--open');
const shouldClean = args.includes('--clean');

function run(cmd, label) {
    console.log(`\n🔧 ${label}...`);
    try {
        execSync(cmd, { stdio: 'inherit', cwd: __dirname + '/..' });
        console.log(`✓ ${label} complete`);
    } catch (error) {
        console.error(`✗ ${label} failed`);
        process.exit(1);
    }
}

console.log('📱 AdoptDontShop Android Build');
console.log('================================\n');

// Clean if requested
if (shouldClean) {
    run('npx cap sync android --clean', 'Clean sync');
} else {
    run('npx cap sync android', 'Capacitor sync');
}

// Copy any updated config
run('npx cap copy android', 'Copy web assets');

console.log('\n✅ Android project synced successfully!');
console.log('   Project: mobile/android');

if (shouldOpen) {
    console.log('\n📂 Opening Android Studio...');
    run('npx cap open android', 'Open Android Studio');
} else {
    console.log('\n💡 Run with --open to launch Android Studio');
    console.log('   Or: npx cap open android');
}
