import React, { useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const Logout = () => {
    useEffect(() => {
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn muốn đăng xuất?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        localStorage.removeItem('id');
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('username');
                        localStorage.removeItem('fullname');
                        localStorage.removeItem('email');
                        localStorage.removeItem('address');
                        localStorage.removeItem('phone');
                        localStorage.removeItem('role');
                        localStorage.removeItem('dateOfBirth');
                        localStorage.removeItem('department');
                        localStorage.removeItem('department_id');
                        localStorage.removeItem('position');
                        localStorage.removeItem('teacher_id');
                        localStorage.removeItem('student_id');
                        localStorage.removeItem('academicYear');
                        localStorage.removeItem('academicYear_id');
                        localStorage.removeItem('isLogin', true);
            
                        window.location.href = '/';
                    }
                },
                {
                    label: 'Hủy',
                    onClick: () => window.location.href = '/'
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => { },
            afterClose: () => { },
            onClickOutside: () => { },
            onKeypress: () => { },
            onKeypressEscape: () => { },
            overlayClassName: "overlay-custom-class-name"
        });
    }, []);

    return (
        <>
        </>
    )
}
export default Logout;