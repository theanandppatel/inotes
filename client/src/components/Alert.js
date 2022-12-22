import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function Alert(props) {
    // const capitalize = (word) => {
    //     const lower = word.toLowerCase();
    //     return lower.charAt(0).toUpperCase() + lower.slice(1);
    // }
    return (
        <>

            <div style={{ height: '50px' }}>
                {props.alert &&

                        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                            
                        <FontAwesomeIcon icon={faCircleCheck} /> {props.alert.msg}
                            
                        </div>
                }
            </div>
        </>
    )
}

export default Alert
