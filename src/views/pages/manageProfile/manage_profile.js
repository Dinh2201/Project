import React, { useState, useRef, useEffect } from 'react'
import {
    CTable,
    CCardHeader,
    CCardBody,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CRow,
    CCol,
    CCard,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CButton,
    CModalFooter,
    CModalBody,
    CModalTitle,
    CModalHeader,
    CModal
} from '@coreui/react'
import axios from 'axios';
import API_URL from '../../../config';
import { format } from 'date-fns';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProfile = () => {
    const role = localStorage.getItem('role');
    const position = localStorage.getItem("position");

    const fullNameRef = useRef(null)
    const dateOfBirthRef = useRef(null)
    const emailRef = useRef(null)
    const phoneRef = useRef(null)
    const addressRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmpasswordRef = useRef(null)

    const [userName, setUserName] = useState('')
    const [fullName, setFullName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [visibleModal, setVisibleModal] = useState(false)
    const [isReload, setIsReload] = useState(false)

    useEffect(() => {
        setUserName(localStorage.getItem('username'))
        setFullName(localStorage.getItem('fullname'))
        setDateOfBirth(localStorage.getItem('dateOfBirth'))
        setEmail(localStorage.getItem('email'))
        setPhone(localStorage.getItem('phone'))
        setAddress(localStorage.getItem('address'))
    }, [isReload])

    const handleEditClick = (id) => {
        setVisibleModal(true);
        setTimeout(() => {
            fullNameRef.current.value = localStorage.getItem('fullname');
            dateOfBirthRef.current.value = format(new Date(localStorage.getItem('dateOfBirth')), 'yyyy-MM-dd')
            addressRef.current.value = localStorage.getItem('address');
            phoneRef.current.value = localStorage.getItem('phone');
            emailRef.current.value = localStorage.getItem('email');
            emailRef.current.setAttribute('readOnly', 'readOnly');
        }, 100)
    }

    const confirmEdit = () => {
        const username = localStorage.getItem('username');
        const password = passwordRef.current.value;
        const confirmpassword = confirmpasswordRef.current.value;
        const fullname = fullNameRef.current.value;
        const dateofbirth = dateOfBirthRef.current.value;
        const phone = phoneRef.current.value;
        const email = emailRef.current.value;
        const address = addressRef.current.value;
        if (!username || !fullname || !dateofbirth || !phone || !email || !address) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (password != confirmpassword) {
            toast('Mật khẩu xác nhận không đúng');
            return;
        }

        if (role == 'student') {
            const studentData = {
                UserName: username,
                Password: password,
                YearID: localStorage.getItem("academicYear_id"),
                DepartmentID: localStorage.getItem("department_id"),
                FullName: fullname,
                DateOfBirth: dateofbirth,
                Email: email,
                Phone: phone,
                Address: address,
            };

            axios.put(`${API_URL}/api/students/${localStorage.getItem("id")}`, studentData)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('fullname', fullname);
                        localStorage.setItem('email', email);
                        localStorage.setItem('address', address);
                        localStorage.setItem('phone', phone);
                        localStorage.setItem('dateOfBirth', dateofbirth);
                        toast(`Cập nhật dữ liệu thành công`);
                        setVisibleModal(false);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin sản phẩm');
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast(error.response.data.message);
                });
        }
        else {
            var flashHead = false;
            if(position == "Trưởng bộ môn"){
                flashHead = true;
            }
            const teacherData = {
                UserName: username,
                Password: password,
                DepartmentID: localStorage.getItem("department_id"),
                FullName: fullname,
                DateOfBirth: dateofbirth,
                Email: email,
                Phone: phone,
                Address: address,
                Position: localStorage.getItem("position"),
                flashHead: flashHead
            };
            axios.put(`${API_URL}/api/teachers/${localStorage.getItem("id")}`, teacherData)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('fullname', fullname);
                        localStorage.setItem('email', email);
                        localStorage.setItem('address', address);
                        localStorage.setItem('phone', phone);
                        localStorage.setItem('dateOfBirth', dateofbirth);
                        toast(`Cập nhật dữ liệu thành công`);
                        setVisibleModal(false);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin sản phẩm');
                    }
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });
        }
    }

    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>THÔNG TIN TÀI KHOẢN</strong>
                        </CCardHeader>
                        <CCardBody>
                            <div className="row">
                                <div className="col-md-3"></div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Thông tin cá nhân</h5>
                                            <p className="card-text">Họ và tên: {fullName}</p>
                                            <p className="card-text">Ngày sinh: {format(new Date(dateOfBirth), 'yyyy-MM-dd')}</p>
                                            <p className="card-text">Email: {email}</p>
                                            <p className="card-text">Số điện thoại: {phone}</p>
                                            <p className="card-text">Địa chỉ: {address}</p>
                                            <a
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                                className="btn btn-primary"
                                            >
                                                Chỉnh sửa thông tin
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3"></div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal alignment="center" scrollable visible={visibleModal} onClose={() => setVisibleModal(false)}>
                <CModalHeader>
                    <CModalTitle>Chỉnh sửa thông tin</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <div className="mb-3">
                            <CFormLabel>Họ và tên</CFormLabel>
                            <CFormInput
                                ref={fullNameRef}
                                type="text"
                                placeholder="Họ và tên"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Ngày sinh</CFormLabel>
                            <CFormInput
                                ref={dateOfBirthRef}
                                type="date"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Email</CFormLabel>
                            <CFormInput
                                ref={emailRef}
                                type="email"
                                placeholder='Email'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Số điện thoại</CFormLabel>
                            <CFormInput
                                ref={phoneRef}
                                type="tel"
                                placeholder='Số điện thoại'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Địa chỉ</CFormLabel>
                            <CFormInput
                                ref={addressRef}
                                type="text"
                                placeholder='Địa chỉ'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Mật khẩu</CFormLabel>
                            <CFormInput
                                ref={passwordRef}
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Xác nhận mật khẩu</CFormLabel>
                            <CFormInput
                                ref={confirmpasswordRef}
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                            />
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={confirmEdit}>Thực thi</CButton>
                </CModalFooter>
            </CModal>
            <ToastContainer />
        </div>
    )
}

export default ManageProfile
