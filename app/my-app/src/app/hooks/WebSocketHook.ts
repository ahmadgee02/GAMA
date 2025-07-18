import { useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppDispatch } from "@/app/store/hooks";
import { setMessageHistory } from '../store/redux/chatSlice';
import { Message } from '../types';


const WebSocketHook = () => {
    const dispatch = useAppDispatch();

    //Public API that will echo messages sent to it back to the client
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL + "/chats/ws";
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    console.log("lastMessage", lastMessage?.data);

    useEffect(() => {
        if (lastMessage !== null) {
            const { type, data } = JSON.parse(lastMessage.data);

            if (type === 'data') {
                const responseData = JSON.parse(data);
                console.log("Received data:", responseData);

                Object.keys(responseData).forEach((key) => {
                    dispatch(
                        setMessageHistory({
                            role: "system",
                            text: responseData[key] || '',
                            heading: key || '',
                        })
                    )
                })
            } else {
                console.log("Socket Response:", data);

            }

        }
    }, [lastMessage]);

    const authenticateConneection = useCallback(() => {
        const token = localStorage.getItem('GAMA:token');
        if (token) {
            sendMessage(JSON.stringify({ action: 'AUTH_TOKEN', payload: token }));
        }
    }, []);

    const sendPrompt = useCallback((promptId: string) => {
        if (promptId) {
            sendMessage(JSON.stringify({ action: 'PROMPT', payload: promptId }));
        }
    }, []);

    const sendDescription = useCallback((discription: string) => {
        if (discription) {
            sendMessage(JSON.stringify({ action: 'DESCRIPTION', payload: discription }));
        }
    }, []);

    const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return {
        connectionStatus,
        authenticateConneection,
        sendPrompt,
        sendDescription,
        handleClickSendMessage
    }
};

export default WebSocketHook;