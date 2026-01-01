import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';


export default async function Navbar() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const handleLogout = async () => {
        'use server';
        const supabaseServer = await createSupabaseServerClient();
        await supabaseServer.auth.signOut();
        // Redirect handled by form submission
    };


    return (
        <nav className='border-b text-white bg-white dark:bg-gray-800'>
            <div className='w-full px-4 py-4 flex justify-between items-center'>
                <Link href="/blog">My blog</Link>
                <div>
                    {user ? (
                        <div className='flex justify-center items-right gap-6'>
                            <span className='text-gray-600 dark:text-gray-300'>hello, {user.email}</span>
                            <Link
                                href="/write"
                                className='text-gray-600 dark:text-gray-300'
                            >
                                <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 border rounded-lg text-white font-semibold cursor-pointer'>
                                    write
                                </button>
                            </Link>


                            <form action={handleLogout}>
                                <button
                                    type='submit'
                                    className='bg-red-600 hover:bg-red-700 px-4 py-2 border rounded-lg text-white font-semibold cursor-pointer'
                                >Log Out</button>
                            </form>

                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className='bg-red-600 hover:bg-red-700 px-4 py-2 border rounded-lg text-white font-semibold cursor-pointer'
                            >
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
