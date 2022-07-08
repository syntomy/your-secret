import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://txiriueatashxdlpwohj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aXJpdWVhdGFzaHhkbHB3b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTcyOTYzNzYsImV4cCI6MTk3Mjg3MjM3Nn0.3efQrZAU62SGkqJh3bR6T39MZ9ZZPk5pBlav6mGvvqs";

export const supabase = createClient(supabaseURL, supabaseAnonKey);