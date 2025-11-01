 import { createServerClient, type CookieOptions } from "@supabase/ssr";
 import { cookies } from "next/headers";

 export async function createServerSupabaseClient() {
   const cookieStore = await cookies();

   const supabase = createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         get(name: string) {
           return cookieStore.get(name)?.value;
         },
         set(name: string, value: string, options?: CookieOptions) {
           const base: CookieOptions = { ...(options || {}) } as CookieOptions;
           cookieStore.set({ name, value, ...base });
         },
         remove(name: string, options?: CookieOptions) {
           const base: CookieOptions = { ...(options || {}) } as CookieOptions;
           cookieStore.set({ name, value: "", ...base, maxAge: 0 });
         },
       },
     }
   );

   return supabase;
 }
