import { Sparkles } from "lucide-react"


export default function Footer() {
    return (
        <footer className="py-12 px-6 border-t">
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <span className="text-xl font-bold">EasyWrite</span>
                </div>
                <p
                // className={darkMode ? 'text-slate-400' : 'text-slate-600'}
                >
                    © 2024 EasyWrite. All rights reserved.
                </p>
            </div>
        </footer>
    )
}