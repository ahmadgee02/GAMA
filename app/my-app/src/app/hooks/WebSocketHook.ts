import { useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppDispatch } from "@/app/store/hooks";
import { setLoading, setMessageHistory, setAgent } from '../store/redux/chatSlice';
import { IncontextExample, Prompt, Role, Message } from '../types';


const WebSocketHook = () => {
    const dispatch = useAppDispatch();

    //Public API that will echo messages sent to it back to the client
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL + "/chats/ws";
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    console.log("lastMessage", lastMessage?.data);

    useEffect(() => {
        if (lastMessage !== null) {
            const { type, data } = JSON.parse(lastMessage.data);
            dispatch(setLoading(false))

            if (type === 'agent') {
                const agentData = JSON.parse(data);
                dispatch(setAgent(agentData))

                const showAgentProperties = [
                    {
                        key: "name",
                        name: "Name"
                    }, {
                        key: "strategyName",
                        name: "Strategy Name",
                    }, {
                        key: "strategyRules",
                        name: "Strategy Rules"
                    }, {
                        key: "status",
                        name: "Status"
                    }, {
                        key: "gameRules",
                        name: "Game Rules"
                    }, {
                        key: "gameMoves",
                        name: "Game Moves"
                    }, {
                        key: "gamePlayers",
                        name: "Game Players"
                    }, {
                        key: "defaultMove",
                        name: "Default Move"
                    }
                ]

                showAgentProperties.forEach(({ key, name }) => {   
                    dispatch(
                        setMessageHistory({
                            role: Role.Agent,
                            text: agentData[key],
                            heading: name,
                        })
                    )

                })
            } if (type === 'data') {
                const responseData = JSON.parse(data);

                Object.keys(responseData || {}).forEach((key) =>
                    dispatch(
                        setMessageHistory({
                            role: Role.Agent,
                            text: responseData[key],
                            heading: key,
                        })
                    )
                )
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

    const sendPrompt = useCallback((prompt: Prompt) => {
        if (prompt) {
            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: prompt.description,
                    heading: "Prompt",
                })
            )
            sendMessage(JSON.stringify({ action: 'PROMPT', payload: prompt._id }));
        }
    }, []);

    const sendIncontextExample = useCallback((example: IncontextExample) => {
        if (example) {
            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: example.description,
                    heading: "Incontext Example",
                })
            )

            sendMessage(JSON.stringify({ action: 'INCONTEXT_EXAMPLE', payload: example._id }));
        }
    }, []);

    const sendDescription = useCallback((description: string) => {
        if (description) {
            dispatch(setLoading(true))

            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: description,
                    heading: "Description",
                })
            )

            sendMessage(JSON.stringify({ action: 'DESCRIPTION', payload: description }));
        }
    }, []);

    const sendEditCode = useCallback((code: string) => {
        if (code) {
            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: code,
                    heading: "Edit Prolog Code",
                })
            )

            sendMessage(JSON.stringify({ action: 'EDIT_CODE', payload: code }));
        }
    }, []);


    const sendUserMove = useCallback((move: string) => {
        if (move) {
            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: move,
                    heading: "User Move",
                })
            )

            sendMessage(JSON.stringify({ action: 'USER_INTERACTION', payload: move }));
        }
    }, []);
    
    
    const saveAgentHistory = useCallback((history: Message[]) => {
        if (history) {
            sendMessage(JSON.stringify({ action: 'SAVE_AGENT', payload: history }));
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
        sendIncontextExample,
        sendDescription,
        sendEditCode,
        sendUserMove,
        handleClickSendMessage,
        saveAgentHistory
    }
};

export default WebSocketHook;