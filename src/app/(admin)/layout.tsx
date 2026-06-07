//SHARED
import { NavbarAdmin } from '@/shared/components/navbar'
//FEATURES
import { AuthProvider } from '@/features/auth/components/auth-provider.component'

export default function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <div className="bg-zinc-100">
                <NavbarAdmin />
                <div className="min-h-screen md:ml-[280px] pb-10 flex bg-zinc-100">
                    <div className="w-[90%] sm:w-[80%] md:w-[90%] lg:w-[80%] h-full mt-24 md:mt-8 mb-10 mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </AuthProvider>
    )
}
