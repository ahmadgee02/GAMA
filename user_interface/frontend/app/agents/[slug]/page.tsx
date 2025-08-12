'use client';

import { FC, useEffect } from "react";
import ProtectedRouteLayout from "@/components/common/ProtectedRouteLayout"
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectLoading, getAgentsHistory } from "@/store/redux/chatSlice"
import { } from "@/store/redux/chatSlice"
import Loading from "@/components/common/Loading";
import { useParams } from 'next/navigation'
import ChatUI from "@/components/chat/ChatUI";

const AgentHistory: FC = () => {
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    const loading = useAppSelector(selectLoading);

    useEffect(() => {
        dispatch(getAgentsHistory(slug?.toString() || ""));
    }, [])

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