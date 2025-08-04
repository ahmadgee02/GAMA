'use client';

import { FC, useEffect } from "react";
import ProtectedRouteLayout from "@/app/components/common/ProtectedRouteLayout"
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectLoading, getAgentsHistory } from "@/app/store/redux/chatSlice"
import { } from "@/app/store/redux/chatSlice"
import Loading from "@/app/components/common/Loading";
import { useParams } from 'next/navigation'
import ChatUI from "@/app/components/chat/ChatUI";

const AgentHistory: FC = () => {
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    
    const loading = useAppSelector(selectLoading);

    useEffect(() => {
        dispatch(getAgentsHistory(slug?.toString() || ""));
    }, [])

    console.log({ loading })

    return (
        <ProtectedRouteLayout>
            {loading ?
                <Loading loading={loading} />
                :
                <ChatUI />
            }

        </ProtectedRouteLayout>
    )
}

export default AgentHistory;