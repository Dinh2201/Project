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

const ManageTasksProgress = () => {
    const role = localStorage.getItem('role') || 'departmentHead'
    const teacher_id = localStorage.getItem('teacher_id')
    const [isReload, setIsReload] = useState(false);

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState(0);

    const [isShowForm, setIsShowForm] = useState(false);

    const [visibleModals, setVisibleModals] = useState({});

    const [theses, setTheses] = useState([]);
    const [thesesItem, setThesesItem] = useState('');

    const [requests, setRequests] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const contentRef = useRef(null);
    const progressRef = useRef(null);

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const [documents, setDocuments] = useState([]);

    const [Status, setStatus] = useState('Kết hoạch');

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
                const thesesResponse = await axios.get(`${API_URL}/api/theses/getByAdvisorID/${teacher_id}`);
                const theses = thesesResponse.data.theses.filter((item) => item.Status !== "Chờ duyệt");
                setThesesItem(theses[0]._id);
                setStatus(theses[0].Status);
                setTheses(theses);
            } catch (error) {
                console.error('Error fetching theses data:', error);
            }
        };

        fetchData();
    }, [isReload]);

    useEffect(() => {
        const fetchRequestsData = async () => {
            try {
                if (thesesItem) {
                    const requestsResponse = await axios.get(`${API_URL}/api/requestsProgress/getRequestsProgresssByThesisId/${thesesItem}`);
                    setRequests(requestsResponse.data);
                }
            } catch (error) {
                setRequests([]);
            }
        };

        fetchRequestsData();
    }, [thesesItem, isReload]);

    const toggleFormVisibility = () => {
        setIsShowForm(!isShowForm);
    };

    const handleAdd_Edit = () => {
        const content = contentRef.current.value;
        if (!content) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const formData = new FormData();
        formData.append('ThesisID', thesesItem);
        formData.append('AdvisorID', teacher_id);
        formData.append('RequestDescription', content);

        for (const file of selectedFiles) {
            formData.append('files', file);
        }

        if (idItem === 0) {
            axios.post(`${API_URL}/api/requestsProgress`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setIsShowForm(false);
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới yêu cầu');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            const progress = progressRef.current.value;
            if (progress < 0 || progress > 100) {
                toast('Giá trị không hợp lệ. Hãy nhập giá trị từ 0 đến 100.');
                return;
            }
            if (!progress) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }
            formData.append('Progress', progress);

            axios.put(`${API_URL}/api/requestsProgress/${idItem}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setIsShowForm(false);
                        toast(`Cập nhật dữ liệu thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin yêu cầu');
                    }
                })
                .catch(() => {
                });
            setIdItem(0);
        }
    };
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };
    const handleEditClick = async (id) => {
        await axios.get(`${API_URL}/api/requestsProgress/${id}/request`)
            .then((response) => {
                if (response.status === 200) {
                    setIsShowForm(true);
                    setIdItem(id);
                    scrollToHeader();

                    setTimeout(() => {
                        const { RequestDescription, Progress } = response.data.requestsProgress;
                        contentRef.current.defaultValue = RequestDescription;
                        progressRef.current.value = Progress;
                        setDocuments(response.data.documents);
                    });

                } else {
                    toast('Lỗi khi lấy thông tin yêu cầu');
                }
            })
            .catch(() => {
            });
    }
    const handleDeleteClick = (id) => {
        setIsShowForm(false);
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa yêu cầu?",
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
            const response = await axios.delete(`${API_URL}/api/requestsProgress/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa yêu cầu');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi: ', error.response.data.message);
        }
    };

    const handleCancelDelete = () => {
    };

    const scrollToHeader = () => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDetailClick = (modalId) => {
        setIsShowForm(false);

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

    const changeStatus = (status, id, originalStatus) => {
        setIsShowForm(false);
        handleModalClose(id);

        confirmAlert({
            title: "Xác nhận",
            message: "Bạn muốn thay đổi trạng thái đề tài?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        axios.put(`${API_URL}/api/theses/changeThesisStatus/${id}/${status}`)
                            .then((response) => {
                                const message = response.data.message;
                                toast(message);
                                setStatus(status);
                                setVisibleModals(false);
                                setIsReload(!isReload);
                            })
                            .catch(() => {
                            });
                    }
                },
                {
                    label: 'Hủy',
                    onClick: () => {
                        e.target.value = originalStatus;
                    }
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
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong ref={headerRef}>QUẢN LÍ YÊU CẦU VÀ TIẾN ĐỘ</strong>
                        </CCardHeader>
                        <CCardBody className='table-responsive'>
                            {
                                theses.length > 0 ?
                                    <>

                                        <div style={{ display: 'flex' }}>
                                            <div className='mb-3'>
                                                <CFormSelect value={thesesItem} onChange={(e) => {
                                                    setThesesItem(e.target.value);
                                                    setIsShowForm(false);
                                                    setStatus(theses.find(thesis => thesis._id === e.target.value).Status);
                                                }}>
                                                    {theses.map((item) => (
                                                        <option key={item._id} value={item._id}>
                                                            {item.Title}
                                                        </option>
                                                    ))}
                                                </CFormSelect>
                                            </div>
                                            <div className='mb-3' style={{ marginLeft: 10 }}>
                                                <CButton
                                                    color='success'
                                                    variant="outline"
                                                    onClick={() => handleDetailClick(thesesItem)}
                                                >
                                                    Chi tiết đề tài
                                                </CButton>
                                                {theses.map(data => (
                                                    <CModal key={data._id} backdrop="static" visible={visibleModals[data._id]} onClose={() => handleModalClose(data._id)}>
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
                                                                    <hr />
                                                                    <div className="mb-3">
                                                                        <CFormLabel>Trạng thái</CFormLabel>
                                                                        <CFormSelect value={Status} onChange={(e) => changeStatus(e.target.value, data._id, data.Status)}>
                                                                            <option>Kế hoạch</option>
                                                                            <option>Đang tiến hành</option>
                                                                            <option>Đã hoàn thành</option>
                                                                            <option>Đã nộp</option>
                                                                            <option>Bị hủy</option>
                                                                            <option>Tạm dừng</option>
                                                                        </CFormSelect>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CModalBody>
                                                        <CModalFooter>
                                                            <CButton color="secondary" onClick={() => handleModalClose(data._id)}>
                                                                Thoát
                                                            </CButton>
                                                        </CModalFooter>
                                                    </CModal>
                                                ))}
                                            </div>
                                        </div>
                                        {
                                            isShowForm ?
                                                <>
                                                    <div className='col-md-4'>
                                                        <div className="mb-3">
                                                            <CFormLabel>Nội dung yêu cầu</CFormLabel>
                                                            <CFormTextarea ref={contentRef} aria-label="With textarea"></CFormTextarea>
                                                        </div>
                                                        <div className="mb-3">
                                                            <CFormLabel>Tệp đính kèm</CFormLabel>
                                                            <CFormInput type='file' onChange={handleFileChange}></CFormInput>
                                                            {
                                                                idItem !== 0 &&
                                                                <>
                                                                    {
                                                                        documents.map((document, index) => (

                                                                            <div className='mt-2' key={index}>
                                                                                {
                                                                                    document.Type === "request" && (
                                                                                        <>
                                                                                            <a
                                                                                                href={document.DocumentPath}
                                                                                                download={`${document.DocumentPath}`}
                                                                                                target="_blank"
                                                                                                className='mr-2'
                                                                                            >
                                                                                                {document.DocumentPath.split('/').pop()}
                                                                                            </a>
                                                                                            <a style={{ cursor: 'pointer', color: 'green' }}
                                                                                                onClick={() => handleDeleteDocClick(document._id)}>Xóa</a>
                                                                                        </>

                                                                                    )
                                                                                }

                                                                            </div>
                                                                        ))
                                                                    }
                                                                </>
                                                            }
                                                        </div>
                                                        {
                                                            <div className="mb-3">
                                                                <CFormLabel>Tiến độ</CFormLabel>
                                                                <CFormInput min={0} max={100} type='number' ref={progressRef}></CFormInput>
                                                            </div>
                                                        }
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
                                                                            onClick={() => handleDeleteClick(requestProgress._id)}
                                                                        >
                                                                            Xóa
                                                                        </CButton>
                                                                        <CButton
                                                                            style={{ marginRight: 10 }}
                                                                            color='warning'
                                                                            variant="outline"
                                                                            onClick={() => handleEditClick(requestProgress._id)}
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

export default ManageTasksProgress
