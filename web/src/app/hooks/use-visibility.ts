import {useEffect, useRef, useState} from 'react';

const useVisibility = (callback: any, options: any) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                callback(); // Trigger the callback when the element is visible
            } else {
                setIsVisible(false);
            }
        }, options);

        observer.observe(elementRef.current);

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [elementRef, callback, options]);

    return [isVisible, elementRef];
};

export default useVisibility;
