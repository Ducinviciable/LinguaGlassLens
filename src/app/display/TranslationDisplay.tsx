"use client";

import { useEffect, useState } from 'react';
import type { DisplaySettings } from '@/components/SettingsPanel';
import { cn } from '@/lib/utils';

const defaultSettings: DisplaySettings = {
    fontSize: 24,
    opacity: 80,
    backgroundColor: '26, 0, 51',
    textColor: '240, 240, 240',
};

export function TranslationDisplay() {
    const [text, setText] = useState('');
    const [textKey, setTextKey] = useState(0);
    const [settings, setSettings] = useState<DisplaySettings>(defaultSettings);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateState = () => {
            try {
                const storedSettings = localStorage.getItem('linguaLensSettings');
                if (storedSettings) {
                    setSettings(JSON.parse(storedSettings));
                } else {
                    setSettings(defaultSettings);
                }

                const storedTranslation = localStorage.getItem('linguaLensTranslation');
                if (storedTranslation) {
                    const { text: newText, key: newKey } = JSON.parse(storedTranslation);
                    if (newKey !== textKey) {
                        setText(newText);
                        setTextKey(newKey);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Failed to update from localStorage", error);
                setSettings(defaultSettings);
            }
        };

        updateState();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'linguaLensSettings' || event.key === 'linguaLensTranslation') {
                updateState();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [textKey]);

    const dynamicStyle = {
        fontSize: `${settings.fontSize}px`,
        backgroundColor: `rgba(${settings.backgroundColor}, ${settings.opacity / 100})`,
        color: `rgb(${settings.textColor})`,
    };

    return (
        <main style={dynamicStyle} className="w-full h-screen p-8 flex items-center justify-center transition-colors duration-500">
            <div 
                key={textKey} 
                className={cn(
                    "w-full text-center font-semibold leading-relaxed transition-opacity duration-500 ease-in-out",
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
            >
                {text}
            </div>
        </main>
    );
}
