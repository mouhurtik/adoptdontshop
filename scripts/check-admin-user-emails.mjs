// Optional isolated PostgreSQL check; never connects to Supabase or a live DB.
// Pass a local @electric-sql/pglite/dist/index.js path as the first argument,
// or install PGlite in your test environment and omit the argument.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleName = process.argv[2]
    ? pathToFileURL(resolve(process.argv[2])).href
    : '@electric-sql/pglite';
const { PGlite } = await import(moduleName);
const db = new PGlite();
const adminId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const noEmailId = '33333333-3333-4333-8333-333333333333';
let checks = 0;

async function asCaller(role, user) {
    await db.exec('RESET ROLE');
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [user || '']);
    await db.exec(`SET ROLE ${role}`);
}

function lookup(ids) {
    return db.query('SELECT * FROM public.admin_get_user_emails($1::uuid[])', [
        ids === null ? null : `{${ids.join(',')}}`,
    ]);
}

async function check(name, fn) {
    await fn();
    checks++;
    process.stdout.write(`PASS ${name}\n`);
}

try {
    await db.exec(`
        CREATE ROLE anon NOLOGIN;
        CREATE ROLE authenticated NOLOGIN;
        CREATE SCHEMA auth;
        CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
            SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
        $$;
        GRANT USAGE ON SCHEMA public, auth TO anon, authenticated;
        CREATE TABLE auth.users (id uuid PRIMARY KEY, email varchar(255));
        CREATE TABLE public.user_roles (user_id uuid, role text);
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        INSERT INTO auth.users VALUES
            ('${adminId}', 'admin@example.test'),
            ('${userId}', 'member@example.test'),
            ('${noEmailId}', '');
        INSERT INTO public.user_roles VALUES ('${adminId}', 'admin');
    `);
    const migration = await readFile(
        new URL('../supabase/migrations/20261106000000_admin_user_emails.sql', import.meta.url),
        'utf8',
    );
    await db.exec(migration);
    await check('migration can be reapplied', () => db.exec(migration));

    await check('function fixes its search path', async () => {
        const { rows } = await db.query("SELECT proconfig FROM pg_proc WHERE oid = 'public.admin_get_user_emails(uuid[])'::regprocedure");
        assert.ok(rows[0].proconfig.includes('search_path=""'));
    });
    await asCaller('anon', null);
    await check('anonymous callers cannot execute the function', () =>
        assert.rejects(lookup([userId]), { code: '42501' }));

    await asCaller('authenticated', null);
    await check('a session without a user ID is denied', () =>
        assert.rejects(lookup([userId]), { code: '42501' }));

    await asCaller('authenticated', userId);
    await check('ordinary users cannot look up even their own email through the admin function', () =>
        assert.rejects(lookup([userId]), { code: '42501' }));

    await asCaller('authenticated', adminId);
    await check('admins receive only requested users', async () => {
        const { rows } = await lookup([userId]);
        assert.deepEqual(rows, [{ id: userId, email: 'member@example.test' }]);
    });
    await check('admins still cannot read the Auth table directly', () =>
        assert.rejects(db.query('SELECT email FROM auth.users'), { code: '42501' }));
    await check('accounts without email return null', async () => {
        const { rows } = await lookup([noEmailId]);
        assert.deepEqual(rows, [{ id: noEmailId, email: null }]);
    });
    await check('empty and null requests do not return all emails', async () => {
        assert.deepEqual((await lookup([])).rows, []);
        assert.deepEqual((await lookup(null)).rows, []);
    });
    await check('unknown IDs do not return other emails', async () => {
        assert.deepEqual((await lookup(['44444444-4444-4444-8444-444444444444'])).rows, []);
    });
    await check('a request of 1000 IDs works without duplicate results', async () => {
        assert.equal((await lookup(Array(1000).fill(userId))).rows.length, 1);
    });
    await check('oversized requests are rejected', () =>
        assert.rejects(lookup(Array(1001).fill(userId)), { code: '22023' }));

    await db.exec('RESET ROLE');
    await db.query('DELETE FROM public.user_roles WHERE user_id = $1', [adminId]);
    await asCaller('authenticated', adminId);
    await check('revoking an admin role immediately removes email access', () =>
        assert.rejects(lookup([userId]), { code: '42501' }));

    process.stdout.write(`${checks} isolated SQL checks passed.\n`);
} finally {
    await db.close();
}
