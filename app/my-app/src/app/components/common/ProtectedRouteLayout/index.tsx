'use client'
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
    setUser,
    logout,
    selectUser
} from "@/app/store/redux/authSlice";
// import { useRouter } from 'next/navigation'
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from 'next/navigation';
import { local_storage_web_key } from "@/app/utils/constants";
import { isExpired, decodeToken } from "react-jwt";
import { User } from "@/app/types";
import { setAuthToken } from "@/app/services/core/httpService";

const ProtectedRouteLayout = (props: any) => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        // getting JWT token from local storage
        const token = localStorage.getItem(local_storage_web_key);

        console.log(token, !user)

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

                    {/* <div id="headlessui-portal-root"></div> */}
                </main>

            </div>
            
        </div>
    );
}

export default ProtectedRouteLayout;