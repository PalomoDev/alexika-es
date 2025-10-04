
import UserProfile from '@/components/auth/UserProfile'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {getUserWithAddress} from "@/lib/actions/user/user.action";



export default async function DashboardPage() {
    // Получаем сессию на сервере
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const userId = session?.user.id;

    if (!userId) return null;

    const userDataResponse = await getUserWithAddress(userId)


    return (
        <div className="main-wrapper px-0 py-12 mt-12">
            <div className="w-full mx-auto">
                <h1 className="text-3xl font-bold text-left mb-8">Panel de gestión de usuario</h1>
                {userDataResponse.data && <UserProfile user={userDataResponse.data}/>}
            </div>
        </div>
    )
}