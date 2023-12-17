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

const ManageTasksProgressStudent = () => {
    const student_id = localStorage.getItem('student_id')
    const [isReload, setIsReload] = useState(false);

    const headerRef = useRef(null);

    const [idItemDoc, setIdItemDoc] = useState(0);
    const [idItemProgress, setIdItemProgress] = useState(0);

    const [isShowForm, setIsShowForm] = useState(false);

    const [visibleModal, setVisibleModal] = useState(false);

    const [theses, setTheses] = useState({});

    const [requests, setRequests] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const progressRef = useRef(null);

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const [documents, setDocuments] = useState([]);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(requests.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return requests.slice((current - 1) * pageSize, current * pageSize);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const thesesResponse = await axios.get(`${API_URL}/api/thesisRegistrations/getByStudentID/${student_id}`);
                const filteredTheses = thesesResponse.data.find(thesis => thesis.Status === "Đã duyệt");
                const requestsResponse = await axios.get(`${API_URL}/api/requestsProgress/getRequestsProgresssByThesisId/${filteredTheses.ThesisID._id}`);
                setRequests(requestsResponse.data);
                setTheses(filteredTheses);
            } catch (error) {
                console.error('Error fetching theses data:', error);
            }
        };
        fetchData();
    }, [isReload]);

    const toggleFormVisibility = () => {
        setIsShowForm(!isShowForm);
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('Type', 'response');

        if (idItemDoc !== 0) {

            for (const file of selectedFiles) {
                formData.append('files', file);
            }

            axios.put(`${API_URL}/api/requestsProgress/${idItemDoc}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setIsShowForm(false);
                        toast('Cập nhật tài liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật tài liệu thành công');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            setIdItemDoc(0);
        }
        if (idItemProgress !== 0) {
            const progress = progressRef.current.value;
            if (progress < 0 || progress > 100) {
                toast('Giá trị không hợp lệ. Hãy nhập giá trị từ 0 đến 100.');
                return;
            }
            formData.append('Progress', progress);

            axios.put(`${API_URL}/api/requestsProgress/${idItemProgress}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setIsShowForm(false);
                        toast(`Cập nhật tiến độ thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật tiến độ');
                    }
                })
                .catch(() => {
                });
            setIdItemProgress(0);
        }
    };
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };
    const handleEditClick = async (id, type) => {
        await axios.get(`${API_URL}/api/requestsProgress/${id}/response`)
            .then((response) => {
                if (response.status === 200) {
                    setIsShowForm(true);
                    if (type === 'doc') {
                        setIdItemDoc(id);
                        setIdItemProgress(0);
                    }
                    else {
                        setIdItemProgress(id);
                        setIdItemDoc(0);
                    }
                    scrollToHeader();

                    setTimeout(() => {
                        if (type === 'doc') {
                            setDocuments(response.data.documents);
                        }
                        else {
                            const { Progress } = response.data.requestsProgress;
                            progressRef.current.value = Progress;
                        }
                    });

                } else {
                    toast('Lỗi khi lấy thông tin yêu cầu');
                }
            })
            .catch(() => {
            });
    }

    const scrollToHeader = () => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDetailClick = () => {
        setIsShowForm(false);

        setVisibleModal(true);
    };

    const handleModalClose = () => {
        setVisibleModal(false);
    };

    const handleDeleteDocClick = (id) => {
        setIsShowForm(false);
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa tài liệu?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmDeleteDoc(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelDeleteDoc()
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

    const handleConfirmDeleteDoc = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/requestsProgress/deleteDocument/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa tài liệu');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi: ', error.response.data.message);
        }
    };

    const handleCancelDeleteDoc = () => {
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
                                <div className='mb-3' style={{ marginLeft: 10 }}>
                                    {
                                        Object.keys(theses).length > 0 &&
                                        <>
                                            <CButton
                                                color='success'
                                                variant="outline"
                                                onClick={() => handleDetailClick()}
                                            >
                                                Chi tiết đề tài
                                            </CButton>
                                            <CModal backdrop="static" visible={visibleModal} onClose={() => handleModalClose()}>
                                                <CModalHeader>
                                                    <CModalTitle>Thông tin chi tiết</CModalTitle>
                                                </CModalHeader>
                                                <CModalBody>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <strong>Tên đề tài: </strong><span className="card-text">{theses.ThesisID.Title}</span><br />
                                                            <strong>Mô tả: </strong><span className="card-text">{theses.ThesisID.Description}</span><br />
                                                            <strong>Giảng viên hướng dẫn: </strong><span className="card-text">{theses.ThesisID.AdvisorID.FullName}</span><br />
                                                            <strong>Giảng viên phản biện 1: </strong><span className="card-text">{theses.ThesisID.ReviewerID1.FullName}</span><br />
                                                            <strong>Giảng viên phản biện 2: </strong><span className="card-text">{theses.ThesisID.ReviewerID2.FullName}</span><br />
                                                            <strong>Giảng viên phản biện 3: </strong><span className="card-text">{theses.ThesisID.ReviewerID3.FullName}</span><br />
                                                            <strong>Ngày bắt đầu: </strong><span className="card-text">{format(new Date(theses.ThesisID.StartDate), 'dd/MM/yyyy')}</span><br />
                                                            <strong>Ngày kết thúc: </strong><span className="card-text">{format(new Date(theses.ThesisID.EndDate), 'dd/MM/yyyy')}</span><br />
                                                            <strong>Trạng thái: </strong><span className="card-text">{theses.Status}</span>
                                                        </div>
                                                    </div>
                                                </CModalBody>
                                                <CModalFooter>
                                                    <CButton color="secondary" onClick={() => handleModalClose()}>
                                                        Thoát
                                                    </CButton>
                                                </CModalFooter>
                                            </CModal>
                                        </>
                                    }
                                </div>
                            </div>
                            {
                                isShowForm &&
                                <>
                                    <div className='col-md-4'>
                                        {
                                            idItemDoc !== 0 &&
                                            <div className="mb-3">
                                                <CFormLabel>Tệp đính kèm</CFormLabel>
                                                <CFormInput type='file' onChange={handleFileChange}></CFormInput>
                                                {
                                                    documents.map((document, index) => (

                                                        <div className='mt-2' key={index}>
                                                            {
                                                                document.Type === "response" && (
                                                                    <>
                                                                        <a
                                                                            href={document.DocumentPath}
                                                                            download={`${document.DocumentPath}`}
                                                                            target="_blank"
                                                                            className='mr-2'
                                                                        >
                                                                            {index + 1}. {document.DocumentPath.split('/').pop()}
                                                                        </a>
                                                                        <a style={{ cursor: 'pointer', color: 'green' }}
                                                                            onClick={() => handleDeleteDocClick(document._id)}>Xóa</a>
                                                                    </>

                                                                )
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {
                                            idItemProgress !== 0 &&
                                            <div className="mb-3">
                                                <CFormLabel>Tiến độ</CFormLabel>
                                                <CFormInput min={0} type='number' ref={progressRef}></CFormInput>
                                            </div>
                                        }
                                    </div>
                                    <div className='mb-3'>
                                        <CButton
                                            color='primary'
                                            variant="outline"
                                            onClick={handleUpdate}
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
                            }
                            {requests.length > 0 ?
                                <>
                                    <CTable bordered borderColor="primary">
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Mô tả yêu cầu</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Tập tin yêu cầu</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Tập tin kết quả</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Tiến độ</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {getData(current, size).map((requestProgress, index) => (
                                                <CTableRow key={requestProgress._id}>
                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{requestProgress.RequestDescription}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {requestProgress.Documents.map((document, index) => (
                                                            document.Type === "request" && (
                                                                <>
                                                                    <a
                                                                        key={index}
                                                                        href={document.DocumentPath}
                                                                        download={`${document.DocumentPath}`}
                                                                        target="_blank"
                                                                    >
                                                                        {index + 1}. {document.DocumentPath.split('/').pop()}
                                                                    </a><br />
                                                                </>

                                                            )
                                                        ))}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {requestProgress.Documents.map((document, index) => (
                                                            document.Type === "response" && (
                                                                <>
                                                                    <a
                                                                        key={index}
                                                                        href={document.DocumentPath}
                                                                        download={`${document.DocumentPath}`}
                                                                        target="_blank"
                                                                    >
                                                                        {index + 1}. {document.DocumentPath.split('/').pop()}
                                                                    </a><br />
                                                                </>
                                                            )
                                                        ))}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{requestProgress.Progress} %</CTableDataCell>
                                                    <CTableDataCell>
                                                        <p style={{ display: 'flex' }}>
                                                            <CButton
                                                                style={{ marginRight: 10 }}
                                                                color='danger'
                                                                variant="outline"
                                                                onClick={() => handleEditClick(requestProgress._id, 'doc')}
                                                            >
                                                                Bổ sung tài liệu
                                                            </CButton>
                                                            <CButton
                                                                style={{ marginRight: 10 }}
                                                                color='warning'
                                                                variant="outline"
                                                                onClick={() => handleEditClick(requestProgress._id, 'progress')}
                                                            >
                                                                Cập nhật tiến độ
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
                                        total={requests.length}
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

export default ManageTasksProgressStudent
