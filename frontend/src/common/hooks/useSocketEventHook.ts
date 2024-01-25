import {useEffect} from 'react';
import {socket} from '../socket';

export const useSocketEventHook = (
    socketEvent: string,
    effect: (response: any) => void,
    dependencies: ReadonlyArray<unknown> = []
) => {
    useEffect(() => {
        const listener = (response: any) => effect(response);

        socket.on(socketEvent, listener);

        return () => {
            socket.off(socketEvent, listener);
        };
    }, dependencies);
};
