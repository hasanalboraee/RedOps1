import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    handler: ShortcutHandler;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, handler }) => {
                if (
                    e.key.toLowerCase() === key.toLowerCase() &&
                    !!e.ctrlKey === !!ctrlKey &&
                    !!e.shiftKey === !!shiftKey &&
                    !!e.altKey === !!altKey
                ) {
                    e.preventDefault();
                    handler(e);
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}; 