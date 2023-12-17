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

const ManageProfile = () => {
    const apiUrl = process.env.API_URL;

    const [visibleModal, setVisibleModal] = useState(false)

    const handleEditClick = (id) => {
        setVisibleModal(true);
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
                                <div className="col-md-4">
                                    <div className="card">
                                        <img
                                            src="/imgProfile/150.png"
                                            className="card-img-top"
                                            alt="Avatar"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">@Model.username</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Thông tin cá nhân</h5>
                                            <p className="card-text">Họ và tên: @Model.name</p>
                                            <p className="card-text">Email: @Model.email</p>
                                            <p className="card-text">Số điện thoại: @Model.phone</p>
                                            <p className="card-text">Địa chỉ: @Model.address</p>
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
                                type="text"
                                placeholder="Họ và tên"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Ngày sinh</CFormLabel>
                            <CFormInput
                                type="date"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Email</CFormLabel>
                            <CFormInput
                                type="email"
                                placeholder='Email'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Số điện thoại</CFormLabel>
                            <CFormInput
                                type="tel"
                                placeholder='Số điện thoại'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Địa chỉ</CFormLabel>
                            <CFormInput
                                type="text"
                                placeholder='Địa chỉ'
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Mật khẩu</CFormLabel>
                            <CFormInput
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Xác nhận mật khẩu</CFormLabel>
                            <CFormInput
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
                    <CButton color="primary">Thực thi</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default ManageProfile
