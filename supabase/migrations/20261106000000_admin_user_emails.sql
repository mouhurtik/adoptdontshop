-- Read Auth emails only for an authenticated administrator's requested users.
-- Do not add emails to public.profiles or grant direct access to auth.users.
BEGIN;

CREATE OR REPLACE FUNCTION public.admin_get_user_emails(p_user_ids uuid[])
RETURNS TABLE (id uuid, email text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF auth.uid() IS NULL OR NOT EXISTS (
        SELECT 1
        FROM public.user_roles AS caller_role
        WHERE caller_role.user_id = auth.uid()
          AND caller_role.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
    END IF;

    -- Bound the size of each email lookup.
    IF coalesce(cardinality(p_user_ids), 0) > 1000 THEN
        RAISE EXCEPTION 'At most 1000 user IDs may be requested' USING ERRCODE = '22023';
    END IF;

    RETURN QUERY
    SELECT auth_user.id, nullif(auth_user.email, '')::text
    FROM auth.users AS auth_user
    WHERE auth_user.id = ANY(p_user_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_user_emails(uuid[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_user_emails(uuid[]) TO authenticated;

COMMENT ON FUNCTION public.admin_get_user_emails(uuid[]) IS
    'Admin-only email lookup. Authorizes auth.uid() against user_roles before reading Auth.';

NOTIFY pgrst, 'reload schema';
COMMIT;
