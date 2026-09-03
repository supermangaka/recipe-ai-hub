import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Supabase admin environment variables are not set');
}

// Клиент с полным доступом (обходит RLS). Использовать ТОЛЬКО на сервере.
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);