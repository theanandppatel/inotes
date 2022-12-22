import React from 'react'
import Notes from './Notes'

const Home = (props) => {
    const { showAlert } = props;
    return (
        <>
            <div className="container my-5">
                <Notes showAlert={showAlert} />
            </div>
            <div
                className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-dark" style={{ marginTop: "0px" }}>
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2022. All rights reserved.
                </div>
                <div className="text-white mb-3 mb-md-0">
                FSD PROJECT
                </div>

                {/* <div>
                    <a href="https://www.facebook.com/theanandppatel" rel="noreferrer" target="_blank" className="text-white me-4">
                        <i to="google.com" className="fab fa-facebook-f" target="_blank"></i>
                    </a>
                    <a href="https://twitter.com/AnandPatel95374" rel="noreferrer" target="_blank" className="text-white me-4">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="mailto:anandpatel95374@gmail.com" rel="noreferrer" target="_blank" className="text-white me-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/theanandppatel/" rel="noreferrer" target="_blank" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div> */}
            </div>
        </>
    )
}

export default Home
