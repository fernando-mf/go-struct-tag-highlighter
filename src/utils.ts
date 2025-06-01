export function debounce<T extends (...args: any) => any>(fn: T, delay = 300) {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, delay);
    };
}

