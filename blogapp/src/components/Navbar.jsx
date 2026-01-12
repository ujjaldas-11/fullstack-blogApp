import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './themeButton';
import { Input } from './ui/input';
// import { useState } from 'react';


export const dynamic = 'force-dynamic';


export default async function Navbar() {
    // const [searchBlog, setSearchBlog] = useState('');

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const {data: posts, error} = await supabase
     .from('posts')
     .select('title');

    const handleLogout = async () => {
        'use server';
        const supabaseServer = await createSupabaseServerClient();
        await supabaseServer.auth.signOut();
    };



    return (
        <nav className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/60'>
            <div className='w-full px-4 py-4 flex justify-between items-center'>
                <a href="/" className='flex justify-center items-center text-lg font-bold gap-2'>
                    <img
                        src='/logo.jpg'
                        alt="EasyWrite"
                        className='h-[50px] w-[50px] rounded-full'
                    />
                    <p>
                        EasyWrite
                    </p>
                </a>


                {/*search bar  */}

                <Link 
                    href="/blog"
                    className='flex justify-center items-center p-2   '>

                    <Input
                        type="text"
                        placeholder="search any blog..."
                        className="w-[50vw] rounded-full" />
                </Link>

                <div>
                    {user ? (
                        <div className='flex justify-center items-right gap-6'>
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
                                    className='font-bold'
                                    type='submit'
                                >Log Out</Button>
                            </form>

                        </div>
                    ) : (
                        <div className='flex justify-center items-right gap-6'>
                            <ModeToggle />
                            <Link
                                href="/login"
                            >
                                <Button className='font-bold'>
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    )
}
