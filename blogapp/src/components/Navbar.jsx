import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './themeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export const dynamic = 'force-dynamic';


export default async function Navbar() {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

    // const handleLogout = async () => {
    //     'use server';
    //     const supabaseServer = await createSupabaseServerClient();
    //     await supabaseServer.auth.signOut();
    // };



    return (
        <nav className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/60'>
            <div className='w-full px-4 py-4 flex justify-between items-center'>
                <Link href="/" className='flex justify-center items-center text-lg font-bold gap-2'>
                    <span className="text-4xl font-bold block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        EasyWrite
                    </span>
                </Link>

                <div>
                    {user ? (
                        <div className='flex justify-center items-right gap-6'>
                            <ModeToggle />
                            <Link href="/profile">
                                <Avatar className="w-10 h-10 border-2 border-slate-100">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                                        {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
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
