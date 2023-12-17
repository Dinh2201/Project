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


const ManageProjectRegistrationPeriod = () => {
    const [isReload, setIsReload] = useState(false);

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState(0);

    const [isShowForm, setIsShowForm] = useState(false);

    const [AcademicYears, setAcademicYears] = useState([]);
    const [AcademicYear, setAcademicYear] = useState('');
    const [AcademicYearSort, setAcademicYearSort] = useState('All');

    const [datas, setDatas] = useState([]);

    const titleRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/academicYears`)
            .then(response => {
                setAcademicYear(response.data[0]._id);
                setAcademicYears(response.data);
            })
            .catch(() => {
            });
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/projectregistrationperiods/academic/${AcademicYearSort}`)
            .then(response => {
                setDatas(response.data);
            })
            .catch(() => {
            });
    }, [isReload, AcademicYearSort]);

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
        const title = titleRef.current.value;
        const startDate = startDateRef.current.value;
        const endDate = endDateRef.current.value;

        if (idItem === 0) {
            if (!title || !startDate || !endDate) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const newData = {
                Title: title,
                YearID: AcademicYear,
                StartDate: startDate,
                EndDate: endDate
            };

            axios.post(`${API_URL}/api/projectregistrationperiods`, newData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới đợt đăng kí');
                    }
                })
                .catch((error) => {
                    toast(error.response.data.message);
                });

        }
        else {

            if (!title || !startDate || !endDate) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const newData = {
                Title: title,
                YearID: AcademicYear,
                StartDate: startDate,
                EndDate: endDate
            };

            axios.put(`${API_URL}/api/projectregistrationperiods/${idItem}`, newData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast(`Cập nhật dữ liệu thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin đợt đăng kí');
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
        await axios.get(`${API_URL}/api/projectregistrationperiods/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setIsShowForm(true);
                    setIdItem(id);
                    scrollToHeader();

                    setTimeout(() => {
                        const { YearID, Title, StartDate, EndDate } = response.data.projectRegistrationPeriod;
                        titleRef.current.value = Title;
                        startDateRef.current.defaultValue = format(new Date(StartDate), 'yyyy-MM-dd');
                        endDateRef.current.defaultValue = format(new Date(EndDate), 'yyyy-MM-dd');
                        setAcademicYear(YearID._id);
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin đợt đăng kí');
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
            message: "Bạn muốn xóa thông tin đợt đăng kí?",
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
            const response = await axios.delete(`${API_URL}/api/projectregistrationperiods/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa đợt đăng kí');
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
                            <strong ref={headerRef}>QUẢN LÍ ĐỢT ĐĂNG KÍ ĐỀ TÀI</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            {
                                isShowForm ? <>
                                    <div className='col-md-4'>
                                        <div className="mb-3">
                                            <CFormLabel>Tiêu đề</CFormLabel>
                                            <CFormInput
                                                ref={titleRef}
                                                type="text"
                                                placeholder="Tiêu đề"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <CFormLabel>Niên khóa</CFormLabel>
                                            <CFormSelect value={AcademicYear} onChange={(e) => {
                                                setAcademicYear(e.target.value);
                                            }}>
                                                {AcademicYears.map(year => (
                                                    <option key={year._id} value={year._id}>{year.YearName}</option>
                                                ))}
                                            </CFormSelect>
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
                                        <div className='row'>
                                            <div className='col-md-9'></div>
                                            <div className='col-md-3'>
                                                <div className='mb-3'>
                                                    <CFormLabel>Niên khóa</CFormLabel>
                                                    <CFormSelect value={AcademicYearSort} onChange={(e) => {
                                                        setAcademicYearSort(e.target.value);
                                                    }}>
                                                        <option value='All'>Tất cả</option>
                                                        {AcademicYears.map(year => (
                                                            <option key={year._id} value={year._id}>{year.YearName}</option>
                                                        ))}
                                                    </CFormSelect>
                                                </div>
                                            </div>
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
                                                    <CTableHeaderCell scope="col">Niên khóa</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Tiêu đề</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Ngày bắt đầu</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Ngày kết thúc</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {getData(current, size).map((data, index) => (
                                                    <CTableRow key={data._id}>
                                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                        <CTableDataCell>{data.YearID.YearName}</CTableDataCell>
                                                        <CTableDataCell>{data.Title}</CTableDataCell>
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

export default ManageProjectRegistrationPeriod
