import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'gwtgnlcigxfovmbbgggi'
const supabaseKey = '258099Kc@hashtag#kc'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)