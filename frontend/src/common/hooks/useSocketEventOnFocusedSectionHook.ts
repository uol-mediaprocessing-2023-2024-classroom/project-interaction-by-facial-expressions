import {selectCurrentSection, selectIsSectionFocused} from '../../app/appSlice';
import {useAppSelector} from '../../app/hooks';
import {Section} from '../enums/Section';
import {useSocketEventHook} from './useSocketEventHook';

export const useSocketEventOnFocusedSectionHook = (
    socketEvent: string,
    effect: (response: any) => void,
    dependencies: ReadonlyArray<unknown> = [],
    sectionsToFocusOn: Section[] = []
) => {
    const currentSection = useAppSelector(state => selectCurrentSection(state));
    const isSectionFocused = useAppSelector(state => selectIsSectionFocused(state));

    useSocketEventHook(
        socketEvent,
        (response: any) => {
            if (!(sectionsToFocusOn.some(section => section === currentSection) && isSectionFocused)) {
                return;
            }

            effect(response);
        },
        [currentSection, isSectionFocused, ...dependencies]
    );
};
