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

const ManageTheses = () => {
    const role = localStorage.getItem('role') || 'departmentHead'

    const apiUrl = process.env.API_URL;

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState('');

    const [isShowForm, setIsShowForm] = useState(false);

    const [visibleModal, setVisibleModal] = useState(false)

    const [Teachers, setTeachers] = useState([]);
    const [Teacher, setTeacher] = useState('');

    useEffect(() => {
        axios.get(`${apiUrl}/api/Teachers`)
            .then(response => {
                setTeacher(response.data[0]._id);
                setTeachers(response.data);
            })
            .catch(() => {
            });
    }, []);

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
                            <strong ref={headerRef}>QUẢN LÍ ĐỀ TÀI</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            {
                                isShowForm ? <>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className="mb-3">
                                                <CFormLabel>Tên đề tài</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    placeholder="Tên đề tài"
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
                                            <div className="mb-3">
                                                <CFormLabel>Trạng thái</CFormLabel>
                                                <CFormSelect>
                                                    <option>Status 1</option>
                                                    <option>Status 2</option>
                                                </CFormSelect>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            {
                                                role !== 'teacher' &&
                                                <>
                                                    <div className="mb-3">
                                                        <CFormLabel>Giảng viên hướng dẫn</CFormLabel>
                                                        <CFormSelect value={Teacher} onChange={(e) => {
                                                            setTeacher(e.target.value);
                                                        }}>
                                                            {Teachers.map(teacher => (
                                                                <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                            ))}
                                                        </CFormSelect>
                                                    </div>
                                                    <div className="mb-3">
                                                        <CFormLabel>Giảng viên phản biện</CFormLabel>
                                                        <CFormSelect value={Teacher} onChange={(e) => {
                                                            setTeacher(e.target.value);
                                                        }}>
                                                            {Teachers.map(teacher => (
                                                                <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                            ))}
                                                        </CFormSelect>
                                                    </div>
                                                </>
                                            }

                                            <div className="mb-3">
                                                <CFormLabel>Mô tả</CFormLabel>
                                                <CFormTextarea aria-label="With textarea"></CFormTextarea>
                                            </div>
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
                                            color='success'
                                            variant="outline"
                                            onClick={toggleFormVisibility}
                                        >
                                            {
                                                role === 'teacher' ? "Đăng kí" : "Thêm mới"
                                            }
                                        </CButton>
                                    </div>

                            }
                            <CTable bordered borderColor="primary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tên đề tài</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Giảng viên hướng dẫn</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Giảng viên phản biện</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Mô tả</CTableHeaderCell>
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
                                        <CTableDataCell>Huỳnh Xuân Phụng</CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                role !== 'teacher' ?
                                                    <>
                                                        Nguyễn Đăng Quang <br />
                                                        Quách Đình Hoàng <br />
                                                        Nguyễn Thi Văn
                                                    </>
                                                    :
                                                    <CFormSelect>
                                                        <option>Status 1</option>
                                                        <option>Status 2</option>
                                                    </CFormSelect>
                                            }
                                        </CTableDataCell>
                                        <CTableDataCell>Mô tả</CTableDataCell>
                                        <CTableDataCell>19/07/2023</CTableDataCell>
                                        <CTableDataCell>19/10/2023</CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                role === 'teacher' ?
                                                    'Trạng thái'
                                                    :
                                                    <CFormSelect>
                                                        <option>Status 1</option>
                                                        <option>Status 2</option>
                                                    </CFormSelect>
                                            }
                                        </CTableDataCell>
                                        <CTableDataCell style={{ display: 'flex' }}>
                                            <CButton
                                                className='mr-2'
                                                color='danger'
                                                variant="outline"
                                                onClick={handleDeleteClick}
                                            >
                                                Xóa
                                            </CButton>
                                            <CButton
                                                className='mr-2'
                                                color='warning'
                                                variant="outline"
                                                onClick={() => handleEditClick(1)}
                                            >
                                                Sửa
                                            </CButton>
                                            <CButton
                                                color='success'
                                                variant="outline"
                                                onClick={() => handleEditClick(1)}
                                            >
                                                Process
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
                    Bạn muốn xóa đề tài?
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

export default ManageTheses
