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
import '../../../App.css';

import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const ManageAcademicYear = () => {

    const academicYear_id = localStorage.getItem('academicYear_id');

    const [isReload, setIsReload] = useState(false);

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState(0);

    const [isShowForm, setIsShowForm] = useState(false);

    const [datas, setDatas] = useState([]);

    const yearNameRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/academicYears`)
            .then(response => {
                setDatas(response.data);
            })
            .catch(() => {
            });
    }, [isReload]);

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
    const toggleFormVisibility = () => {
        setIsShowForm(!isShowForm);
        setIdItem(0);
    };

    const handleAdd_Edit = () => {
        const yearName = yearNameRef.current.value;
        const startDate = startDateRef.current.value;
        const endDate = endDateRef.current.value;

        if (idItem === 0) {
            if (!yearName || !startDate || !endDate) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const newData = {
                YearName: yearName,
                StartDate: startDate,
                EndDate: endDate
            };

            axios.post(`${API_URL}/api/academicYears`, newData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới niên khóa');
                    }
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });

        }
        else {

            if (!yearName || !startDate || !endDate) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const newData = {
                YearName: yearName,
                StartDate: startDate,
                EndDate: endDate
            };

            axios.put(`${API_URL}/api/academicYears/${idItem}`, newData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast(`Cập nhật dữ liệu thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin niên khóa');
                    }
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });
            setIdItem(0);
        }
    }

    const handleEditClick = async (id) => {
        console.log(id)
        await axios.get(`${API_URL}/api/academicYears/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setIsShowForm(true);
                    setIdItem(id);
                    scrollToHeader();

                    setTimeout(() => {
                        const { YearName, StartDate, EndDate } = response.data.academicyear;
                        yearNameRef.current.value = YearName;
                        startDateRef.current.defaultValue = format(new Date(StartDate), 'yyyy-MM-dd');
                        endDateRef.current.defaultValue = format(new Date(EndDate), 'yyyy-MM-dd');
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin niên khóa');
                }
            })
            .catch((error) => {
                toast(error.response.data.message);
            });
    }

    const handleDeleteClick = (id) => {
        setIsShowForm(false);
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin niên khóa?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmDelete(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelDelete()
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

    const handleConfirmDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/academicYears/${id}`);
            if (response.status === 200) {
                if (id === academicYear_id) {
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

                    window.location.href = '/login';
                }
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa niên khóa');
            }
        } catch (error) {
            toast('Lỗi:', error.response.data.message);
        }
    };

    const handleCancelDelete = () => {
    };

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
                                                ref={yearNameRef}
                                                type="text"
                                                placeholder="Tên niên khóa"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel>Ngày bắt đầu</CFormLabel>
                                            <CFormInput
                                                ref={startDateRef}
                                                type="date"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel>Ngày kết thúc</CFormLabel>
                                            <CFormInput
                                                ref={endDateRef}
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
                            {
                                datas.length > 0 ?
                                    <>
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
                                                {getData(current, size).map((data, index) => (
                                                    <CTableRow key={data._id}>
                                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                        <CTableDataCell>{data.YearName}</CTableDataCell>
                                                        <CTableDataCell>{format(new Date(data.StartDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                        <CTableDataCell>{format(new Date(data.EndDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <p style={{ display: 'flex' }}>
                                                                <CButton
                                                                    className='mr-2'
                                                                    color='danger'
                                                                    variant="outline"
                                                                    onClick={() => { handleDeleteClick(data._id) }}
                                                                >
                                                                    Xóa
                                                                </CButton>
                                                                <CButton
                                                                    color='warning'
                                                                    variant="outline"
                                                                    onClick={() => handleEditClick(data._id)}
                                                                >
                                                                    Sửa
                                                                </CButton>
                                                            </p>
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

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <ToastContainer />
        </div>
    )
}

export default ManageAcademicYear
