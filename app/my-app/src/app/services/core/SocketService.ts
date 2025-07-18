import React from 'react';
// import AppConfig from "AppConfig.json";
// import { setError } from "reducers/errorSlice";
// import store from 'app/store'
// import { AppSocketMessage, ErrorMessage } from '@models/index'
// import { setOrderStatus } from "@app/reducers/appSlice";

class SocketService {

    public socket!: WebSocket;
    public isAuthenticated = false;
    private authenticationCallBack = (isSuccess: boolean) => { };

    initSocketConnection = () => {
        return new Promise((resolve, reject) => {
            const isBrowser = typeof window !== "undefined";
            const SOCKET_URL = process.env.SOCKET_URL
            if (!isBrowser || !SOCKET_URL) {
                return
            }

            this.socket = new WebSocket(SOCKET_URL);

            this.socket.addEventListener('open', (event) => {
                console.log('socket connection open');
                resolve(event)
            });

            this.socket.addEventListener('error', (event) => {
                console.log('socket connection error => ', event);

                // const errorMessage: ErrorMessage = { cause: 'WS connection failed.' }
                // store.dispatch(setError(errorMessage))
                reject(event)
            });

            this.socket.addEventListener('close', (event) => {
                console.log('socket connection close');
            });

            this.socket.addEventListener('message', (event: any) => {
                const fs = new FileReader();
                fs.onload = (ev: any) => {
                    try {
                        // AppSocketMessage
                        const message = JSON.parse(ev.target.result);
                        this.handleSocketMessage(message);
                    } catch (error) {
                        console.log('failed to parse socket message => ', error);
                    }
                };


                fs.readAsText(event.data);
            });
        })
    }

    closeSocketConnection = () => {
        if (!this.socket.readyState) {
            return
        }
        
        this.socket.close();
    }

    handleSocketMessage = (message:  ) => {
        // if (message.error) {
        //     const errorMessage: ErrorMessage = { cause: message.cause + '! ', details: message.details }
        //     store.dispatch(setError(errorMessage))
        // }

        switch (message.responseType) {
            case 'VALIDATE_AUTH_TOKEN_RESPONSE': {
                this.authenticationCallBack(!message.error)
                this.authenticationCallBack = (isSuccess: boolean) => { };
                break;
            }
            case 'EXEC_REPORT': {
                // store.dispatch(setOrderStatus(message.payload))
                break;
            }
        }
    }

    authenticateSocketConnection = (authToken: string): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            if (!authToken) {
                reject('Please login');
            }

            this.authenticationCallBack = resolve;

            this.socket.send(
                JSON.stringify({
                    action: 'VALIDATE_AUTH_TOKEN',
                    payload: {
                        authToken,
                    },
                })
            );
        });
    }

    heartbeatRequest = async () => {
        if (!this.socket.readyState) {
            return
        }

        this.socket.send(
            JSON.stringify({
                action: 'HEARTBEAT_REQUEST'
            })
        );
    }
}


export const socketService = new SocketService();