import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextScrambleProps {
    children: string;
    className?: string;
    duration?: number;
    delay?: number;
    chars?: string;
    once?: boolean;
}

const defaultChars = '!<>-_\\/[]{}—=+*^?#________';

export const TextScramble: React.FC<TextScrambleProps> = ({
    children,
    className = '',
    duration = 1.5,
    delay = 0,
    chars = defaultChars,
    once = true,
}) => {
    const elementRef = useRef<HTMLSpanElement>(null);
    const [displayText, setDisplayText] = useState('');
    const frameRef = useRef(0);
    const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);

    useEffect(() => {
        if (!elementRef.current) return;

        const text = children;
        const length = text.length;

        // Initialize queue
        queueRef.current = [];
        for (let i = 0; i < length; i++) {
            const charFrom = chars[Math.floor(Math.random() * chars.length)];
            const charTo = text[i];
            if (charFrom && charTo) {
                queueRef.current.push({
                    from: charFrom,
                    to: charTo,
                    start: Math.floor(Math.random() * 40),
                    end: Math.floor(Math.random() * 40) + 40,
                });
            }
        }

        let frame = 0;
        const totalFrames = Math.max(...queueRef.current.map(q => q.end));

        const update = () => {
            let output = '';
            let complete = 0;

            for (let i = 0; i < queueRef.current.length; i++) {
                const item = queueRef.current[i];
                if (!item) continue;

                const { from, to, start, end } = item;
                let char = item.char;

                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    if (!char || Math.random() < 0.28) {
                        char = randomChar || char;
                        queueRef.current[i] = { ...item, char };
                    }
                    output += char || '';
                } else {
                    output += from;
                }
            }

            setDisplayText(output);

            if (complete === queueRef.current.length) {
                return;
            }

            frame++;
            frameRef.current = requestAnimationFrame(update);
        };

        // Start animation with ScrollTrigger
        ScrollTrigger.create({
            trigger: elementRef.current,
            start: 'top 85%',
            onEnter: () => {
                setTimeout(() => {
                    update();
                }, delay * 1000);
            },
            once,
        });

        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    }, [children, chars, delay, once]);

    return (
        <span ref={elementRef} className={`font-mono ${className}`}>
            {displayText || children.split('').map(() => ' ').join('')}
        </span>
    );
};

// Typewriter effect with scramble
interface TypewriterScrambleProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export const TypewriterScramble: React.FC<TypewriterScrambleProps> = ({
    words,
    className = '',
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
}) => {
    const [currentText, setCurrentText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        if (!currentWord) return;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                setCurrentText(currentWord.slice(0, currentText.length + 1));

                if (currentText === currentWord) {
                    // Word complete, start deleting after pause
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                // Deleting with scramble effect
                if (currentText.length > 0) {
                    const scrambled = currentText.slice(0, -1) +
                        defaultChars[Math.floor(Math.random() * defaultChars.length)];
                    setCurrentText(scrambled);

                    setTimeout(() => {
                        setCurrentText(currentText.slice(0, -1));
                    }, deletingSpeed / 2);
                } else {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={`font-mono ${className}`}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

// Decode effect for numbers
interface DecodeNumberProps {
    value: number;
    className?: string;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

export const DecodeNumber: React.FC<DecodeNumberProps> = ({
    value,
    className = '',
    duration = 1.5,
    suffix = '',
    prefix = '',
}) => {
    const [displayValue, setDisplayValue] = useState('0');
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const chars = '0123456789';
        const targetStr = value.toString();
        let frame = 0;
        const totalFrames = duration * 60;

        ScrollTrigger.create({
            trigger: elementRef.current,
            start: 'top 85%',
            onEnter: () => {
                const animate = () => {
                    const progress = frame / totalFrames;

                    if (progress >= 1) {
                        setDisplayValue(targetStr);
                        return;
                    }

                    let result = '';
                    for (let i = 0; i < targetStr.length; i++) {
                        if (i < Math.floor(progress * targetStr.length)) {
                            result += targetStr[i];
                        } else {
                            result += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }

                    setDisplayValue(result);
                    frame++;
                    requestAnimationFrame(animate);
                };

                animate();
            },
            once: true,
        });
    }, [value, duration]);

    return (
        <span ref={elementRef} className={`font-mono ${className}`}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};
