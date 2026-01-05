import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';

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
        <nav className='border-b dark:bg-gray-800'>
            <div className='w-full px-4 py-4 flex justify-between items-center'>
                <Link href="/" className='text-lg font-bold'>MyBlog</Link>
                <div>
                    {user ? (
                        <div className='flex justify-center items-right gap-6'>
                            <span className='text-gray-600 dark:text-gray-300'>hello, {user.email}</span>
                            <Link
                                href="/write"
                                className='cursor-pointer'
                            >
                                <Button
                                >
                                    write
                                </Button>
                            </Link>


                            <form action={handleLogout}>
                                <Button
                                    type='submit'
                                >Log Out</Button>
                            </form>

                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                            >
                                <Button>
                                    Log In
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
