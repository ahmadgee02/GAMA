import { useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppDispatch } from "@/store/hooks";
import { setLoading, setMessageHistory, setAgent } from '../store/redux/chatSlice';
import { addNewAgent } from '../store/redux/pageSlice';
import { IncontextExample, Prompt, Role, Message, Mode, ExtraDataType } from '../types';
import toast from 'react-hot-toast';


const WebSocketHook = () => {
    const dispatch = useAppDispatch();

    //Public API that will echo messages sent to it back to the client
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL + "/agents/ws";
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

                const extraData = showAgentProperties.map(({ key, name }) => {
                    const text = Array.isArray(agentData[key]) ? agentData[key].join(", ") : agentData[key]

                    return {
                        type: key === "strategyRules" ? ExtraDataType.Code : ExtraDataType.Text,
                        text,
                        heading: name,
                    }
                })

                dispatch(
                    setMessageHistory({
                        role: Role.Agent,
                        text: agentData["gameRules"],
                        heading: "Game Rule Code:",
                        type: ExtraDataType.Code,
                        data: extraData
                    })
                )

            } else if (type === 'new_agent') {
                const agentData = JSON.parse(data);
                dispatch(addNewAgent(agentData));
            } else if (type === 'data') {
                const responseData = JSON.parse(data);

                Object.keys(responseData || {}).forEach((key) => {
                    const text = Array.isArray(responseData[key]) ? responseData[key].join(", ") : responseData[key]

                    dispatch(
                        setMessageHistory({
                            role: Role.Agent,
                            text: text,
                            heading: key,
                        })
                    )
                })
            } else {
                console.log("Socket Response:", data);
                toast.success(data)
            }
        }
    }, [lastMessage]);

    const authenticateConneection = useCallback(() => {
        const token = localStorage.getItem('GAMA:token');
        if (token) {
            sendMessage(JSON.stringify({ action: 'AUTH_TOKEN', payload: token }));
        }
    }, []);

    const sendPrompt = useCallback((prompt: Prompt, mode: Mode) => {
        if (prompt) {
            const heading = mode === Mode.Game ? "Stratergy" : "Game"

            dispatch(
                setMessageHistory({
                    role: Role.User,
                    text: prompt.shortDescription,
                    heading: `${heading}: ${prompt.name}`,
                    data: [{
                        text: prompt.description,
                        type: ExtraDataType.Code,
                        heading: `${heading} Code:`
                    }]
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
                    text: example.shortDescription,
                    heading: "Incontext Example",
                    data: [{
                        text: example.description,
                        type: ExtraDataType.Code,
                        heading: "Incontext Example Code"
                    }]
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
                    type: ExtraDataType.Code
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

    const saveAgentName = useCallback((name: string) => {
        if (name) {
            sendMessage(JSON.stringify({ action: 'SAVE_AGENT_NAME', payload: name }));
        }
    }, []);

    const saveAgentHistory = useCallback((history: Message[]) => {
        if (history) {
            sendMessage(JSON.stringify({ action: 'SAVE_AGENT', payload: history }));
        }
    }, []);

    const loadAgent = useCallback((agentId: string) => {
        if (agentId) {
            sendMessage(JSON.stringify({ action: 'LOAD_AGENT', payload: agentId }));
        }
    }, []);
    
    const setAgentMode = useCallback((mode: string) => {
        if (mode) {
            sendMessage(JSON.stringify({ action: 'SET_MODE', payload: mode }));
        }
    }, []);

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
        saveAgentHistory,
        saveAgentName,
        loadAgent,
        setAgentMode
    }
};

export default WebSocketHook;