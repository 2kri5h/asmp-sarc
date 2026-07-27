import React, { useEffect } from 'react'
import { preLoaderAnim } from '../../animations/preload';
import './PreLoader.css'

const PreLoader = () => {
    useEffect(() => {
        preLoaderAnim();
      }, []);

    return (
        <div className="preloader">
            <div className="texts-container">
                <span>Alumni &nbsp;</span>
                <span>Student &nbsp;</span>
                <span>Mentorship &nbsp;</span>   
                <span>Program &nbsp;</span>
            </div>
        </div>
    )
}

export default PreLoader