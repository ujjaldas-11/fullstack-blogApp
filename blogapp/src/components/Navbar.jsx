import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './themeButton';


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
        <nav className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70'>
            <div className='w-full px-4 py-4 flex justify-between items-center'>
                <Link href="/" className='text-lg font-bold'>
                    <img
                     src='/EasyWrite.png' 
                     alt="EasyWrite" width={70} height={30}/>
                </Link>
                <div>
                    {user ? (
                        <div className='flex justify-center items-right gap-6'>
                            <span className='text-gray-600 dark:text-gray-300'>hello, {user.email}</span>
                            <ModeToggle />
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
                                    className='bg-red-600 text-white font-bold'
                                    type='submit'
                                >Log Out</Button>
                            </form>

                        </div>
                    ) : (
                        <>
                            <ModeToggle />
                            <Link
                                href="/login"
                            >
                                <Button className='bg-red-600 text-white font-bold'>
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
