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

const apiUrl = process.env.API_URL;

const ManageAcademicYear = () => {

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState('');

    const [isShowForm, setIsShowForm] = useState(false);

    const [visibleModal, setVisibleModal] = useState(false)

    const toggleFormVisibility = () => {
        setIsShowForm(!isShowForm);
    };

    const handleAdd_Edit = () => {

    }

    const handleEditClick = (id) => {
        setIsShowForm(true);
        setIdItem(id);
        scrollToHeader();
    }

    const handleDeleteClick = () => {
        setVisibleModal(true);
    }

    const handleConfirmDelete = () => {

    }

    const scrollToHeader = () => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong ref={headerRef}>QUẢN LÍ NIÊN KHÓA</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            {
                                isShowForm ? <>
                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <CFormLabel>Tên niên khóa</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                placeholder="Tên niên khóa"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel>Ngày bắt đầu</CFormLabel>
                                            <CFormInput
                                                type="date"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel>Ngày kết thúc</CFormLabel>
                                            <CFormInput
                                                type="date"
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <CButton
                                                color='primary'
                                                variant="outline"
                                                onClick={handleAdd_Edit}
                                            >
                                                Thực thi
                                            </CButton>
                                            <CButton
                                                color='warning'
                                                variant="outline"
                                                onClick={toggleFormVisibility}
                                                style={{ marginLeft: 10 }}
                                            >
                                                Hủy
                                            </CButton>
                                        </div>
                                    </div>
                                </>
                                    :
                                    <>
                                        <div className='mb-3'>
                                            <CButton
                                                color='success'
                                                variant="outline"
                                                onClick={toggleFormVisibility}
                                            >
                                                Thêm mới
                                            </CButton>
                                        </div>
                                    </>

                            }
                            <CTable bordered borderColor="primary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tên niên khóa</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Ngày bắt đầu</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Ngày kết thúc</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                        <CTableDataCell>Niên khóa 1</CTableDataCell>
                                        <CTableDataCell>19/07/2023</CTableDataCell>
                                        <CTableDataCell>19/10/2023</CTableDataCell>
                                        <CTableDataCell style={{display: 'flex'}}>
                                            <CButton
                                                className='mr-2'
                                                color='danger'
                                                variant="outline"
                                                onClick={handleDeleteClick}
                                            >
                                                Xóa
                                            </CButton>
                                            <CButton
                                                color='warning'
                                                variant="outline"
                                                onClick={() => handleEditClick(1)}
                                            >
                                                Sửa
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
                    <CModalTitle>Xác nhận xóa</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn muốn xóa niên khóa?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleConfirmDelete}>Thực thi</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default ManageAcademicYear
