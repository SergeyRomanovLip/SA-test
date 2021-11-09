import { useState, useCallback, useEffect } from 'react'

export const useDimensions = () => {
  const [windowDemensions, setWindowDimensions] = useState({ width: window.innerWidth })
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return { windWidth: windowDemensions.width }
}
