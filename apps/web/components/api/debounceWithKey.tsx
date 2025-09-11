

type DebouncedFunction<T extends (...args: any[]) => void> = {
    (...args: Parameters<T>): void;
    cancel: () => void
}

const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

export function debounceWithKey<T extends (...args: any[]) => void>(key: string, fn: T, delay: number = 800): DebouncedFunction<T> {
    const debouncedFn = (...args: Parameters<T>) => {
        if (debounceMap.has(key)) {
            clearTimeout(debounceMap.get(key)!);
        }
        debounceMap.set(key, setTimeout(() => {
            fn(...args);
            debounceMap.delete(key);
        }, delay));
    };
    debouncedFn.cancel = () => {
        if (debounceMap.has(key)) {
            clearTimeout(debounceMap.get(key)!);
            debounceMap.delete(key);
        }
    };
    return debouncedFn;
}
