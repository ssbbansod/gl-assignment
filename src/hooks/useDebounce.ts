import { useState, useEffect } from "react";

const useDebounce = (searchKey: string, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<string>(searchKey);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(searchKey);
        }, delay)
        return () => {
            clearTimeout(timer);
        }
    }, [searchKey])

    return debounceValue;
}
export default useDebounce;