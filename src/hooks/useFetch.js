import { useState, useEffect } from 'react';

export default function useFetch(url) {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(url)
        .then(res => {
            if (!res.ok) throw new Error ('Could not fetch the courses')
            return res.json()
        })
        .then(json => {
            setData(json)
            setIsPending(false)
        })
        .catch(err => {
            setError(err.message)
            setIsPending(false)
        }, [url])

    })
    return {data, isPending, error}
}