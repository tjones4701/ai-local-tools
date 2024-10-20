import { useState, useEffect } from "react";

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function useId() {
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        setId(uuid());
    }, []);
    return id;
}