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

const ManageTasksProgress = () => {
    const role = localStorage.getItem('role') || 'departmentHead'

    const apiUrl = process.env.API_URL;

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState('');

    const [isShowForm, setIsShowForm] = useState(false);

    const [visibleModalDelete, setVisibleModalDelete] = useState(false)
    const [visibleModalDetail, setVisibleModalDetail] = useState(false)

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
        setVisibleModalDelete(true);
        setVisibleModalDetail(false);
        setIsShowForm(false);
    }

    const handleConfirmDelete = () => {

    }

    const handleDetailClick = () => {
        setVisibleModalDetail(true);
        setVisibleModalDelete(false);
        setIsShowForm(false);
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
                            <strong ref={headerRef}>QUẢN LÍ YÊU CẦU VÀ TIẾN ĐỘ</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            <div style={{ display: 'flex' }}>
                                <div className='mb-3'>
                                    <CFormSelect>
                                        <option>option1</option>
                                    </CFormSelect>
                                </div>
                                <div className='mb-3' style={{ marginLeft: 10 }}>
                                    <CButton
                                        color='success'
                                        variant="outline"
                                        onClick={toggleFormVisibility}
                                    >
                                        Chi tiết đề tài
                                    </CButton>
                                </div>
                            </div>
                            {
                                isShowForm ?
                                    <>
                                        <div className='col-md-4'>
                                            <div className="mb-3">
                                                <CFormLabel>Nội dung yêu cầu</CFormLabel>
                                                <CFormTextarea aria-label="With textarea"></CFormTextarea>
                                            </div>
                                            <div className="mb-3">
                                                <CFormLabel>Tệp đính kèm</CFormLabel>
                                                <CFormInput type='file'></CFormInput>
                                            </div>
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
                                    </>
                                    :
                                    <div className='mb-3'>
                                        <CButton
                                            color='primary'
                                            variant="outline"
                                            onClick={toggleFormVisibility}
                                        >
                                            Thêm mới yêu cầu
                                        </CButton>
                                    </div>
                            }
                            <CTable bordered borderColor="primary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Mô tả yêu cầu</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tiến độ</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                        <CTableDataCell>Xây dựng web</CTableDataCell>
                                        <CTableDataCell>85%</CTableDataCell>

                                        <CTableDataCell style={{ display: 'flex' }}>
                                            <CButton
                                                style={{ marginRight: 10 }}
                                                color='danger'
                                                variant="outline"
                                                onClick={handleDeleteClick}
                                            >
                                                Xóa
                                            </CButton>
                                            <CButton
                                                style={{ marginRight: 10 }}
                                                color='warning'
                                                variant="outline"
                                                onClick={() => handleEditClick(1)}
                                            >
                                                Sửa
                                            </CButton>
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
            <CModal backdrop="static" visible={visibleModalDelete} onClose={() => setVisibleModalDelete(false)}>
                <CModalHeader>
                    <CModalTitle>Xác nhận xóa</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn muốn xóa yêu cầu?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModalDelete(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleConfirmDelete}>Thực thi</CButton>
                </CModalFooter>
            </CModal>
            <CModal alignment="center" scrollable visible={visibleModalDetail} onClose={() => setVisibleModalDetail(false)}>
                <CModalHeader>
                    <CModalTitle>Chi tiết yêu cầu</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="card">
                        <div className="card-body">
                            <strong>Nội dung yêu cầu: </strong><span className="card-text">Xây dựng ứng dụng web</span><br />
                            <strong>Tài liệu: </strong><span className="card-text">Huỳnh Xuân Phụng</span><br />
                            <strong>Tiến độ: </strong><span className="card-text">45%</span>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModalDetail(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default ManageTasksProgress
