import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";

export function supabaseServerClient() {
  const cookieStore = cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // The auth{} will change once we add the authentication
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
