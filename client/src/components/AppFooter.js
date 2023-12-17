import React, { useState, useEffect } from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <CFooter>
      <div>
        <span className="ms-1">TRƯỜNG ĐẠI HỌC </span><strong>SƯ PHẠM KĨ THUẬT TP. HỒ CHÍ MINH</strong>
      </div>
      <div className="ms-auto">
        <span className="me-1">{time.toLocaleString()}</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
