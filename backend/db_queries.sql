-- Job Dheako PostgreSQL inspection queries
-- Connect to database: jobdheako on PostgreSQL port 5433
-- All statements in this file are read-only.

-- 1. Confirm the active server and database.
SELECT current_database() AS database_name,
       current_user AS connected_role,
       inet_server_addr() AS server_address,
       inet_server_port() AS server_port,
       current_timestamp AS checked_at;

-- 2. List application tables and their approximate row counts.
SELECT schemaname,
       relname AS table_name,
       n_live_tup AS estimated_rows
FROM pg_stat_user_tables
ORDER BY schemaname, relname;

-- 3. Count exact rows in each application table.
SELECT 'app_state' AS table_name, count(*) AS row_count FROM app_state
UNION ALL
SELECT 'user_accounts', count(*) FROM user_accounts
UNION ALL
SELECT 'auth_challenges', count(*) FROM auth_challenges
ORDER BY table_name;

-- 4. Summarize JSON-backed app state without dumping user data.
SELECT key,
       jsonb_typeof(value::jsonb) AS value_type,
       CASE jsonb_typeof(value::jsonb)
           WHEN 'array' THEN jsonb_array_length(value::jsonb)
           WHEN 'object' THEN (SELECT count(*) FROM jsonb_object_keys(value::jsonb))
           ELSE NULL
       END AS item_or_property_count,
       updated_at
FROM app_state
ORDER BY key;

-- 5. Inspect shared catalog sizes.
SELECT key AS catalog,
       jsonb_array_length(value::jsonb) AS item_count
FROM app_state
WHERE key IN ('jobs', 'companies', 'career_resources')
  AND jsonb_typeof(value::jsonb) = 'array'
ORDER BY key;

-- 6. Browse sample jobs (edit LIMIT as needed).
SELECT item->>'id' AS id,
       item->>'title' AS title,
       item->>'company' AS company,
       item->>'location' AS location
FROM app_state AS state
CROSS JOIN LATERAL jsonb_array_elements(state.value::jsonb) AS item
WHERE state.key = 'jobs'
ORDER BY title
LIMIT 50;

-- 7. Browse companies.
SELECT jsonb_pretty(item) AS company
FROM app_state AS state
CROSS JOIN LATERAL jsonb_array_elements(state.value::jsonb) AS item
WHERE state.key = 'companies'
ORDER BY item->>'name'
LIMIT 50;

-- 8. List accounts without exposing password hashes or challenge codes.
SELECT id,
       email,
       full_name,
       role,
       phone,
       is_verified,
       created_at
FROM user_accounts
ORDER BY created_at DESC;

-- 9. Count challenges by purpose and whether they have been used.
SELECT purpose,
       (used_at IS NOT NULL) AS is_used,
       count(*) AS challenge_count,
       count(*) FILTER (WHERE expires_at <= current_timestamp) AS expired_count
FROM auth_challenges
GROUP BY purpose, (used_at IS NOT NULL)
ORDER BY purpose, is_used;

-- 10. Find user-owned state keys (does not print their contents).
SELECT split_part(key, ':', 2) AS user_id,
       split_part(key, ':', 3) AS state_name,
       jsonb_typeof(value::jsonb) AS value_type,
       updated_at
FROM app_state
WHERE key LIKE 'user:%'
ORDER BY user_id, state_name;

-- 11. Inspect one selected state document. Replace the key with the desired
-- key, such as 'jobs', 'profile', or 'user:<user-id>:applications'.
SELECT key, jsonb_pretty(value::jsonb) AS document, updated_at
FROM app_state
WHERE key = 'jobs';

-- 12. Check for missing shared seed catalogs.
SELECT required.key AS missing_catalog
FROM (VALUES ('jobs'), ('companies'), ('career_resources')) AS required(key)
LEFT JOIN app_state AS state ON state.key = required.key
WHERE state.key IS NULL;
