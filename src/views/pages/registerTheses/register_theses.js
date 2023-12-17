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
import API_URL from '../../../config';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import '../../../App.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';


const RegisterTheses = () => {
    const role = localStorage.getItem('role')
    const departmentId = localStorage.getItem('department_id')
    const student_id = localStorage.getItem('student_id')
    const academicYear_id = localStorage.getItem('academicYear_id')
    const [isReload, setIsReload] = useState(false);

    const [isRegister, setIsRegister] = useState(false);

    const headerRef = useRef(null);

    const [visibleModals, setVisibleModals] = useState({});
    const [isWithinRange, setIsWithinRange] = useState(false)

    const [datas, setDatas] = useState([]);
    useEffect(() => {
        const data = {
            yearId: academicYear_id
        };

        axios.post(`${API_URL}/api/thesisRegistrations/checkDateWithinRange`, data)
            .then(response => {
                if (response.data.isWithinRange) {
                    setIsWithinRange(true);
                    axios.get(`${API_URL}/api/theses/getByDepartmentID/${departmentId}`)
                        .then(response => {
                            setDatas(response.data.theses);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    axios.get(`${API_URL}/api/thesisRegistrations/getByStudentID/${student_id}`)
                        .then(response => {
                            if (response.data.length) {
                                setIsRegister(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.error(error);
            });

    }, [isReload]);


    const handleAdd = (id, name) => {
        setVisibleModals((prev) => ({
            ...prev,
            [id]: false,
        }));
        confirmAlert({
            title: "Xác nhận",
            message: `Bạn muốn đăng kí đề tài ${name}?`,
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmAdd(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelAdd()
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
    }
    const handleConfirmAdd = (id) => {
        const data = {
            thesisIDValue: id,
            studentIDValue: student_id,
        };

        axios.post(`${API_URL}/api/thesisRegistrations`, data)
            .then((response) => {
                if (response.status === 200) {
                    toast(response.data.message);
                    setIsReload(!isReload);
                } else {
                    toast(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                toast(error.response.data.message);
            });
    }

    const handleCancelAdd = () => {
    };

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(datas.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return datas.slice((current - 1) * pageSize, current * pageSize);
    };

    const PaginationChange = (page, pageSize) => {
        setCurrent(page);
        setSize(pageSize)
    }

    const PrevNextArrow = (current, type, originalElement) => {
        if (type === 'prev') {
            return <button><i className="fa fa-angle-double-left"></i></button>;
        }
        if (type === 'next') {
            return <button><i className="fa fa-angle-double-right"></i></button>;
        }
        return originalElement;
    }

    const handleDetailClick = (modalId) => {
        setVisibleModals((prev) => ({
            ...prev,
            [modalId]: true,
        }));
    };

    const handleModalClose = (modalId) => {
        setVisibleModals((prev) => ({
            ...prev,
            [modalId]: false,
        }));
    };

    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong ref={headerRef}>DANH SÁCH ĐỀ TÀI</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            {
                                isWithinRange ?
                                    <>
                                        {
                                            datas.length > 0 ?
                                                <>
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
                                                            {getData(current, size).map((data, index) => (
                                                                data.Status !== 'Chờ duyệt' &&
                                                                <CTableRow key={data._id}>
                                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                                    <CTableDataCell>{data.Title}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.StartDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.EndDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.Status}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell style={{ width: '109px' }}>
                                                                        <CButton
                                                                            className='mr-2'
                                                                            color='success'
                                                                            variant="outline"
                                                                            onClick={() => handleDetailClick(data._id)}
                                                                        >
                                                                            Chi tiết
                                                                        </CButton>

                                                                        <CModal backdrop="static" visible={visibleModals[data._id]} onClose={() => handleModalClose(data._id)}>
                                                                            <CModalHeader>
                                                                                <CModalTitle>Thông tin chi tiết</CModalTitle>
                                                                            </CModalHeader>
                                                                            <CModalBody>
                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <strong>Tên đề tài: </strong><span className="card-text">{data.Title}</span><br />
                                                                                        <strong>Mô tả: </strong><span className="card-text">{data.Description}</span><br />
                                                                                        <strong>Giảng viên hướng dẫn: </strong><span className="card-text">{data.AdvisorID.FullName}</span><br />
                                                                                        <strong>Giảng viên phản biện 1: </strong><span className="card-text">{data.ReviewerID1.FullName}</span><br />
                                                                                        <strong>Giảng viên phản biện 2: </strong><span className="card-text">{data.ReviewerID2.FullName}</span><br />
                                                                                        <strong>Giảng viên phản biện 3: </strong><span className="card-text">{data.ReviewerID3.FullName}</span><br />
                                                                                        <strong>Ngày bắt đầu: </strong><span className="card-text">{format(new Date(data.StartDate), 'dd/MM/yyyy')}</span><br />
                                                                                        <strong>Ngày kết thúc: </strong><span className="card-text">{format(new Date(data.EndDate), 'dd/MM/yyyy')}</span><br />
                                                                                        <strong>Trạng thái: </strong><span className="card-text">{data.Status}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </CModalBody>
                                                                            <CModalFooter>
                                                                                <CButton color="secondary" onClick={() => handleModalClose(data._id)}>
                                                                                    Thoát
                                                                                </CButton>
                                                                                {!isRegister &&
                                                                                    <CButton color="primary" onClick={() => handleAdd(data._id, data.Title)}>Đăng kí</CButton>
                                                                                }
                                                                            </CModalFooter>
                                                                        </CModal>
                                                                    </CTableDataCell>
                                                                </CTableRow>
                                                            ))}

                                                        </CTableBody>
                                                    </CTable>
                                                    <Pagination
                                                        className="pagination-data float-left"
                                                        showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                                        onChange={PaginationChange}
                                                        total={datas.length}
                                                        current={current}
                                                        pageSize={size}
                                                        showSizeChanger={false}
                                                        itemRender={PrevNextArrow}
                                                        onShowSizeChange={PerPageChange}
                                                    />
                                                </>
                                                : <p>Không có dữ liệu</p>
                                        }
                                    </> : <p>Chưa đến đợt đăng kí đề tài</p>
                            }
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <ToastContainer />
        </div>
    )
}

export default RegisterTheses
