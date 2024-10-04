import { Outlet } from "react-router-dom"


export default function AuthLayout() {
    return (
        <div className="h-full w-full flex items-center flex-wrap overflow-auto justify-center gap-x-8">
            <Outlet />
        </div>
    )
}