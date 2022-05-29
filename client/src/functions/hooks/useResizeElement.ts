import { useState, useEffect } from "react"

const useResizeElement = (element: HTMLElement) => {
    const [height, setHeight] = useState(element ? element.scrollHeight : 0)
    const resizeObserver = new ResizeObserver(entries => {
        setHeight(entries[0].target.scrollHeight)
    })

    useEffect(() => {
        if (element) {
            resizeObserver.observe(element)
        }
        return () => {
            resizeObserver.disconnect()
        }
    })
    
    return height
}

export default useResizeElement