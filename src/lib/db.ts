// src/lib/db.ts
import { createClient } from "@supabase/supabase-js";

console.log("ENV-DEBUG: NEXT_PUBLIC_SUPABASE_URL   =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("ENV-DEBUG: NEXT_PUBLIC_SUPABASE_ANON_KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log("ENV-DEBUG: SUPABASE_SERVICE_KEY =", process.env.SUPABASE_SERVICE_KEY);

const supabaseUrl       = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey= process.env.SUPABASE_SERVICE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
