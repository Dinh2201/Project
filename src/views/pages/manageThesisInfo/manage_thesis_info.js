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


const ManageThesisInfo = () => {
    const role = localStorage.getItem('role')
    const departmentId = localStorage.getItem('department_id')
    const student_id = localStorage.getItem('student_id')
    const [isReload, setIsReload] = useState(false);


    const headerRef = useRef(null);

    const [visibleModal, setVisibleModal] = useState(false)

    const [datas, setDatas] = useState([]);
    const [dataPending, setDataPending] = useState([]);
    const [dataApproved, setDataApproved] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/thesisRegistrations/getByStudentID/${student_id}`)
            .then(response => {
                setDatas(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [isReload]);


    const handleAdd = (id) => {
        const data = {
            thesisIDValue: id,
            studentIDValue: student_id,
        };

        axios.post(`${API_URL}/api/thesisRegistrations`, data)
            .then((response) => {
                if (response.status === 200) {
                    setVisibleModal(false);
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

    const handleDetailClick = async (id) => {

        await axios.get(`${API_URL}/api/thesisRegistrations/getByThesisID/${id}`)
            .then(response => {
                const allData = response.data;

                const pendingData = allData.filter(item => item.Status === "Chờ duyệt");

                const approvedData = allData.filter(item => item.Status === "Đã duyệt");

                setDataPending(pendingData);
                setDataApproved(approvedData);
            })
            .catch((error) => {
                console.log(error);
            });
        setVisibleModal(true);
    }

    const handleAccept = (id, name) => {
        setVisibleModal(false);
        confirmAlert({
            title: "Xác nhận",
            message: `Bạn muốn duyệt đăng kí đề tài cho ${name}?`,
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmAccept(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelAccept()
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
    const handleConfirmAccept = (id) => {
        axios.put(`${API_URL}/api/thesisRegistrations/${id}`)
            .then((response) => {
                const message = response.data.message;
                toast(message);
                setIsReload(!isReload);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleCancelAccept = () => {
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn muốn xóa yêu cầu đăng kí đề tài?",
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
            const response = await axios.delete(`${API_URL}/api/thesisRegistrations/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa yêu cầu đăng kí đề tài');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi: ', error.response.data.message);
        }
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
                                                    <CTableRow key={data._id}>
                                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                        <CTableDataCell>{data.ThesisID.Title}</CTableDataCell>
                                                        <CTableDataCell>{format(new Date(data.ThesisID.StartDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                        <CTableDataCell>{format(new Date(data.ThesisID.EndDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {data.Status}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <p style={{ display: 'flex' }}>
                                                                <CButton
                                                                    className='mr-2'
                                                                    color='success'
                                                                    variant="outline"
                                                                    onClick={() => handleDetailClick(data.ThesisID._id)}
                                                                >
                                                                    Chi tiết
                                                                </CButton>
                                                                {data.Status !== 'Đã duyệt' &&
                                                                    <CButton
                                                                        className='mr-2'
                                                                        color='danger'
                                                                        variant="outline"
                                                                        onClick={() => handleDeleteClick(data._id)}
                                                                    >
                                                                        Xóa
                                                                    </CButton>
                                                                }
                                                            </p>

                                                            <CModal backdrop="static" visible={visibleModal} onClose={() => setVisibleModal(false)}>
                                                                <CModalHeader>
                                                                    <CModalTitle>Thông tin chi tiết</CModalTitle>
                                                                </CModalHeader>
                                                                <CModalBody>
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            <strong>Tên đề tài: </strong><span className="card-text">{data.ThesisID.Title}</span><br />
                                                                            <strong>Mô tả: </strong><span className="card-text">{data.ThesisID.Description}</span><br />
                                                                            <strong>Giảng viên hướng dẫn: </strong><span className="card-text">{data.ThesisID.AdvisorID.FullName}</span><br />
                                                                            <strong>Giảng viên phản biện 1: </strong><span className="card-text">{data.ThesisID.ReviewerID1.FullName}</span><br />
                                                                            <strong>Giảng viên phản biện 2: </strong><span className="card-text">{data.ThesisID.ReviewerID2.FullName}</span><br />
                                                                            <strong>Giảng viên phản biện 3: </strong><span className="card-text">{data.ThesisID.ReviewerID3.FullName}</span><br />
                                                                            <strong>Ngày bắt đầu: </strong><span className="card-text">{format(new Date(data.ThesisID.StartDate), 'dd/MM/yyyy')}</span><br />
                                                                            <strong>Ngày kết thúc: </strong><span className="card-text">{format(new Date(data.ThesisID.EndDate), 'dd/MM/yyyy')}</span><br />
                                                                            <strong>Trạng thái đề tài: </strong><span className="card-text">{data.ThesisID.Status}</span>
                                                                            {dataApproved.length > 0 &&
                                                                                <>
                                                                                    <h4>Danh sách thành viên:</h4>
                                                                                    {
                                                                                        dataApproved.map((data, index) => (
                                                                                            <React.Fragment key={index}>
                                                                                                {data.StudentID && data.StudentID.FullName && (
                                                                                                    <>
                                                                                                        <span className="card-text">{data.StudentID.FullName} </span>
                                                                                                        {data.GroupLeader && '(Nhóm trưởng)'}
                                                                                                        <br />
                                                                                                    </>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                    }
                                                                                </>
                                                                            }
                                                                            {dataPending.length > 0 && data.GroupLeader &&
                                                                                <>
                                                                                    <h4>Danh sách thành viên chờ duyệt:</h4>
                                                                                    {
                                                                                        dataPending.map((data, index) => (
                                                                                            <React.Fragment key={index}>
                                                                                                {data.StudentID && data.StudentID.FullName && (
                                                                                                    <>
                                                                                                        <span className="card-text mr-2">{data.StudentID.FullName}</span>
                                                                                                        <a style={{ color: "green", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleAccept(data._id, data.StudentID.FullName)}>Duyệt</a>
                                                                                                    </>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </CModalBody>
                                                                <CModalFooter>
                                                                    <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                                                                        Thoát
                                                                    </CButton>
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
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <ToastContainer />
        </div>
    )
}

export default ManageThesisInfo
