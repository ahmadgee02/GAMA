'use client'
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
    setUser,
    logout
} from "@/store/redux/authSlice";
// import { useRouter } from 'next/navigation'
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from 'next/navigation';
import { local_storage_web_key } from "@/utils/constants";
import { isExpired, decodeToken } from "react-jwt";
import { User } from "@/types";
import { setAuthToken } from "@/services/core/httpService";

const ProtectedRouteLayout = (props: any) => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem(local_storage_web_key);

        if (token) {
            const myDecodedToken = decodeToken(token) as User;
            const isMyTokenExpired = isExpired(token);

            if (isMyTokenExpired) {
                dispatch(logout(router))
            }
            setAuthToken(token);
            dispatch(setUser(myDecodedToken));
        } else {
            dispatch(logout(router))
        }
    }, []);

    return (
        <div>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="lg:pl-72">
                <Header setSidebarOpen={setSidebarOpen} />

                <main className="relative w-full h-full">
                    <div className="mx-auto max-w-4xl">{props.children}</div>
                </main>

            </div>
            
        </div>
    );
}

export default ProtectedRouteLayout;