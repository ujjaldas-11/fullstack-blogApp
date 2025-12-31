import {createMiddlewareClient} from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    });


const supabase = createMiddlewareClient({request, response: supabaseResponse});

await supabase.auth.getSession();

return supabaseResponse;
}
