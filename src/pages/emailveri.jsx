import React from 'react'
import { Link } from 'react-router-dom'

const emailveri = () => {
    return (
        <div>emailveri
            <Link to="/auth/newpassword">
                Send login link
            </Link>
        </div>
    )
}

export default emailveri