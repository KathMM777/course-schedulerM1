import { useEffect, useState } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            setIsPending(true);
            setError(null);

            try {
                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('Could not fetch the data');
                }

                const result = await response.json();

                if (!controller.signal.aborted) {
                    setData(result);
                    setIsPending(false);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err.message);
                    setIsPending(false);
                }
            }
        }

        fetchData();

        return () => controller.abort();
    }, [url]);

    return { data, isPending, error };
}

export default useFetch;