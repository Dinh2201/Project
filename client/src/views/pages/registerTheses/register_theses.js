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
    CModal,
    CFormTextarea
} from '@coreui/react'
import axios from 'axios';

const RegisterTheses = () => {
    const role = localStorage.getItem('role') || 'departmentHead'

    const apiUrl = process.env.API_URL;

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState('');

    const [visibleModal, setVisibleModal] = useState(false)

    const handleDetailClick = () => {
        setVisibleModal(true);
    }

    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong ref={headerRef}>DANH SÁCH ĐỀ TÀI</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>

                            <CTable bordered borderColor="primary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tên đề tài</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Ngày bắt đầu</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Ngày kết thúc</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                        <CTableDataCell>Xây dựng web</CTableDataCell>
                                        <CTableDataCell>19/07/2023</CTableDataCell>
                                        <CTableDataCell>19/10/2023</CTableDataCell>
                                        <CTableDataCell>
                                            Trạng thái
                                        </CTableDataCell>
                                        <CTableDataCell style={{ width: '93px' }}>
                                            <CButton
                                                className='mr-2'
                                                color='success'
                                                variant="outline"
                                                onClick={handleDetailClick}
                                            >
                                                Chi tiết
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal backdrop="static" visible={visibleModal} onClose={() => setVisibleModal(false)}>
                <CModalHeader>
                    <CModalTitle>Thông tin chi tiết</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="card">
                        <div className="card-body">
                            <strong>Tên đề tài: </strong><span className="card-text">Xây dựng ứng dụng web</span><br/>
                            <strong>Giảng viên hướng dẫn: </strong><span className="card-text">Hồ Sỹ Hùng</span><br/>
                            <strong>Giảng viên phản biện: </strong><span className="card-text">Dương Minh Ninh, Lý Công Thành, Lê Thành Đô</span><br/>
                            <strong>Mô tả: </strong><span className="card-text">Xây dựng website bằng MEVN</span><br/>
                            <strong>Ngày bắt đầu: </strong><span className="card-text">20/10/2023</span><br/>
                            <strong>Ngày kết thúc: </strong><span className="card-text">20/2/2024</span><br/>
                            <strong>Trạng thái: </strong><span className="card-text">Trống</span>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                        Thoát
                    </CButton>
                    <CButton color="primary">Đăng kí</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default RegisterTheses
