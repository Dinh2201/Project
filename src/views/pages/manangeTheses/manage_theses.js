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

const ManageTheses = () => {
    const role = localStorage.getItem('role')
    const department = localStorage.getItem('department')
    const teacher_id = localStorage.getItem('teacher_id')

    const [isReload, setIsReload] = useState(false);

    const headerRef = useRef(null);

    const [idItem, setIdItem] = useState('');

    const [isShowForm, setIsShowForm] = useState(false);

    const [datas, setDatas] = useState([]);
    const [Teachers, setTeachers] = useState([]);
    const [Advisor, setAdvisor] = useState('');
    const [Reviewer1, setReviewer1] = useState('');
    const [Reviewer2, setReviewer2] = useState('');
    const [Reviewer3, setReviewer3] = useState('');
    const [Status, setStatus] = useState('Chờ duyệt');

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const [Departments, setDepartments] = useState([]);
    const [Department, setDepartment] = useState('');

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

    useEffect(() => {
        axios.get(`${API_URL}/api/teachers/department/All`)
            .then(response => {
                if (role !== 'teacher') {
                    setAdvisor(response.data[0]._id);
                }
                else {
                    setAdvisor(teacher_id);
                }
                setReviewer1(response.data[0]._id);
                setReviewer2(response.data[0]._id);
                setReviewer3(response.data[0]._id);
                setTeachers(response.data);
            })
            .catch(() => {
            });
        axios.get(`${API_URL}/api/departments`)
            .then(response => {
                setDepartment(response.data[0]._id);
                setDepartments(response.data);
            })
            .catch(() => {
            });
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/theses`)
            .then(response => {
                if (localStorage.getItem('role') === 'departmentHead' || localStorage.getItem('role') === 'teacher') {
                    const theses = response.data.filter((item) => item.DepartmentID.DepartmentName === localStorage.getItem('department'));
                    setDatas(theses);
                }
                else setDatas(response.data);
            })
            .catch(() => {
            });
    }, [isReload]);

    const toggleFormVisibility = () => {
        setIsShowForm(!isShowForm);
        setIdItem(0);
    };

    const handleAdd_Edit = () => {
        const title = titleRef.current.value;
        const description = descriptionRef.current.value;
        const status = Status;
        const startDate = startDateRef.current.value;
        const endDate = endDateRef.current.value;

        if (!title || !description || !status || !startDate || !endDate) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const thesesData = {
            Title: title,
            Description: description,
            DepartmentID: Department,
            AdvisorID: Advisor,
            ReviewerID1: Reviewer1,
            ReviewerID2: Reviewer2,
            ReviewerID3: Reviewer3,
            Status: status,
            StartDate: startDate,
            EndDate: endDate,
        };

        if (idItem === 0) {
            axios.post(`${API_URL}/api/theses`, thesesData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới đề tài');
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast(error.response.data.message);
                });

        }
        else {

            axios.put(`${API_URL}/api/theses/${idItem}`, thesesData)
                .then((response) => {
                    if (response.status === 200) {
                        toggleFormVisibility();
                        toast(`Cập nhật dữ liệu thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin đề tài');
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast(error.response.data.message);
                });
            setIdItem(0);
        }
    }

    const handleEditClick = async (id) => {
        await axios.get(`${API_URL}/api/theses/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setIsShowForm(true);
                    setIdItem(id);
                    scrollToHeader();

                    setTimeout(() => {
                        console.log(response.data)
                        const { Title, Description, Status, StartDate, EndDate, DepartmentID, AdvisorID, ReviewerID1, ReviewerID2, ReviewerID3 } = response.data.theses;
                        titleRef.current.value = Title;
                        descriptionRef.current.defaultValue = Description;
                        startDateRef.current.defaultValue = format(new Date(StartDate), 'yyyy-MM-dd');
                        endDateRef.current.defaultValue = format(new Date(EndDate), 'yyyy-MM-dd');

                        setStatus(Status)
                        setDepartment(DepartmentID);
                        setAdvisor(AdvisorID);
                        setReviewer1(ReviewerID1);
                        setReviewer2(ReviewerID2);
                        setReviewer3(ReviewerID3);
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin đề tài');
                }
            })
            .catch(() => {
            });
    }

    const handleDeleteClick = (id) => {
        setIsShowForm(false);
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin đề tài?",
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
            const response = await axios.delete(`${API_URL}/api/theses/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa đề tài');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi: ', error.response.data.message);
        }
    };

    const handleCancelDelete = () => {

    }

    const scrollToHeader = () => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const changeStatus = (e, status, id, originalStatus) => {
        setIsShowForm(false);
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

            {role === "student" ? <p>KHÔNG CÓ QUYỀN TRUY CẬP</p> :
                <>
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
                                                            ref={titleRef}
                                                            type="text"
                                                            placeholder="Tên đề tài"
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
                                                    {
                                                        (role === 'departmentHead' || role === 'admin') &&
                                                        <div className="mb-3">
                                                            <CFormLabel>Trạng thái</CFormLabel>
                                                            <CFormSelect value={Status} onChange={(e) => {
                                                                setStatus(e.target.value);
                                                            }}>
                                                                <option>Chờ duyệt</option>
                                                                <option>Kế hoạch</option>
                                                                <option>Đang tiến hành</option>
                                                                <option>Đã hoàn thành</option>
                                                                <option>Đã nộp</option>
                                                                <option>Bị hủy</option>
                                                                <option>Tạm dừng</option>
                                                            </CFormSelect>
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                    (role === 'departmentHead' || role === 'admin') &&
                                                    <div className='col-md-4'>
                                                        <>
                                                            <div className="mb-3">
                                                                <CFormLabel>Giảng viên hướng dẫn</CFormLabel>
                                                                <CFormSelect value={Advisor} onChange={(e) => {
                                                                    setAdvisor(e.target.value);
                                                                }}>
                                                                    {Teachers.map(teacher => (
                                                                        <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                                    ))}
                                                                </CFormSelect>
                                                            </div>
                                                            <div className="mb-3">
                                                                <CFormLabel>Giảng viên phản biện 1</CFormLabel>
                                                                <CFormSelect value={Reviewer1} onChange={(e) => {
                                                                    setReviewer1(e.target.value);
                                                                }}>
                                                                    {Teachers.map(teacher => (
                                                                        <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                                    ))}
                                                                </CFormSelect>
                                                            </div>
                                                            <div className="mb-3">
                                                                <CFormLabel>Giảng viên phản biện 2</CFormLabel>
                                                                <CFormSelect value={Reviewer2} onChange={(e) => {
                                                                    setReviewer2(e.target.value);
                                                                }}>
                                                                    {Teachers.map(teacher => (
                                                                        <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                                    ))}
                                                                </CFormSelect>
                                                            </div>
                                                            <div className="mb-3">
                                                                <CFormLabel>Giảng viên phản biện 3</CFormLabel>
                                                                <CFormSelect value={Reviewer3} onChange={(e) => {
                                                                    setReviewer3(e.target.value);
                                                                }}>
                                                                    {Teachers.map(teacher => (
                                                                        <option key={teacher._id} value={teacher._id}>{teacher.FullName}</option>
                                                                    ))}
                                                                </CFormSelect>
                                                            </div>
                                                        </>
                                                    </div>
                                                }
                                                <div className='col-md-4'>
                                                    <div className="mb-3">
                                                        <CFormLabel>Chuyên ngành</CFormLabel>
                                                        <CFormSelect value={Department} onChange={(e) => {
                                                            setDepartment(e.target.value);
                                                        }}>
                                                            <option value='All'>Tất cả</option>
                                                            {Departments.map(department => (
                                                                <option key={department._id} value={department._id}>{department.DepartmentName}</option>
                                                            ))}
                                                        </CFormSelect>
                                                    </div>
                                                    <div className="mb-3">
                                                        <CFormLabel>Mô tả</CFormLabel>
                                                        <CFormTextarea ref={descriptionRef} aria-label="With textarea"></CFormTextarea>
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
                                    {
                                        datas.length > 0 ?
                                            <>

                                                <CTable bordered borderColor="primary">
                                                    <CTableHead>
                                                        <CTableRow>
                                                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Tên đề tài</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Chuyên ngành</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Giảng viên hướng dẫn</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Giảng viên phản biện 1</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Giảng viên phản biện 2</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Giảng viên phản biện 3</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Mô tả</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Ngày bắt đầu</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Ngày kết thúc</CTableHeaderCell>
                                                            <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>

                                                            {
                                                                (role === 'departmentHead' || role === 'admin') &&

                                                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                                            }
                                                        </CTableRow>
                                                    </CTableHead>
                                                    <CTableBody>
                                                        {getData(current, size).map((data, index) => (
                                                            (role === 'departmentHead' || role === 'teacher')
                                                                ?
                                                                <CTableRow key={data._id}>
                                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                                    <CTableDataCell>{data.Title}</CTableDataCell>
                                                                    <CTableDataCell>{data.DepartmentID.DepartmentName}</CTableDataCell>
                                                                    <CTableDataCell>{data.AdvisorID.FullName}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID1.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID2.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID3.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>{data.Description}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.StartDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.EndDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {
                                                                            role === 'teacher' ?
                                                                                data.Status
                                                                                :
                                                                                <CFormSelect onChange={(e) => changeStatus(e, e.target.value, data._id, data.Status)} style={{ width: 'auto' }}>
                                                                                    <option selected={data.Status === 'Chờ duyệt'}>Chờ duyệt</option>
                                                                                    <option selected={data.Status === 'Kế hoạch'}>Kế hoạch</option>
                                                                                    <option selected={data.Status === 'Đang tiến hành'}>Đang tiến hành</option>
                                                                                    <option selected={data.Status === 'Đã hoàn thành'}>Đã hoàn thành</option>
                                                                                    <option selected={data.Status === 'Đã nộp'}>Đã nộp</option>
                                                                                    <option selected={data.Status === 'Bị hủy'}>Bị hủy</option>
                                                                                    <option selected={data.Status === 'Tạm dừng'}>Tạm dừng</option>
                                                                                </CFormSelect>
                                                                        }
                                                                    </CTableDataCell>
                                                                    {
                                                                        (role === 'departmentHead' || role === 'admin') &&
                                                                        <CTableDataCell>
                                                                            <p style={{ display: 'flex' }}>

                                                                                <CButton
                                                                                    className='mr-2'
                                                                                    color='danger'
                                                                                    variant="outline"
                                                                                    onClick={() => handleDeleteClick(data._id)}
                                                                                >
                                                                                    Xóa
                                                                                </CButton>
                                                                                <CButton
                                                                                    className='mr-2'
                                                                                    color='warning'
                                                                                    variant="outline"
                                                                                    onClick={() => handleEditClick(data._id)}
                                                                                >
                                                                                    Sửa
                                                                                </CButton>
                                                                                {/* <CButton
                                                                                    color='success'
                                                                                    variant="outline"
                                                                                    onClick={() => handleEditClick(data._id)}
                                                                                >
                                                                                    Process
                                                                                </CButton> */}
                                                                            </p>
                                                                        </CTableDataCell>
                                                                    }
                                                                </CTableRow>
                                                                :
                                                                <CTableRow key={data._id}>
                                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                                    <CTableDataCell>{data.Title}</CTableDataCell>
                                                                    <CTableDataCell>{data.DepartmentID.DepartmentName}</CTableDataCell>
                                                                    <CTableDataCell>{data.AdvisorID.FullName}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID1.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID2.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {data.ReviewerID3.FullName}
                                                                    </CTableDataCell>
                                                                    <CTableDataCell>{data.Description}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.StartDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>{format(new Date(data.EndDate), 'dd/MM/yyyy')}</CTableDataCell>
                                                                    <CTableDataCell>
                                                                        {
                                                                            role === 'teacher' ?
                                                                                data.Status
                                                                                :
                                                                                <CFormSelect onChange={(e) => changeStatus(e, e.target.value, data._id, data.Status)} style={{ width: 'auto' }}>
                                                                                    <option selected={data.Status === 'Chờ duyệt'}>Chờ duyệt</option>
                                                                                    <option selected={data.Status === 'Kế hoạch'}>Kế hoạch</option>
                                                                                    <option selected={data.Status === 'Đang tiến hành'}>Đang tiến hành</option>
                                                                                    <option selected={data.Status === 'Đã hoàn thành'}>Đã hoàn thành</option>
                                                                                    <option selected={data.Status === 'Đã nộp'}>Đã nộp</option>
                                                                                    <option selected={data.Status === 'Bị hủy'}>Bị hủy</option>
                                                                                    <option selected={data.Status === 'Tạm dừng'}>Tạm dừng</option>
                                                                                </CFormSelect>
                                                                        }
                                                                    </CTableDataCell>
                                                                    {
                                                                        role === 'departmentHead' || role === 'admin' &&

                                                                        <CTableDataCell>
                                                                            <p style={{ display: 'flex' }}>

                                                                                <CButton
                                                                                    className='mr-2'
                                                                                    color='danger'
                                                                                    variant="outline"
                                                                                    onClick={() => handleDeleteClick(data._id)}
                                                                                >
                                                                                    Xóa
                                                                                </CButton>
                                                                                <CButton
                                                                                    className='mr-2'
                                                                                    color='warning'
                                                                                    variant="outline"
                                                                                    onClick={() => handleEditClick(data._id)}
                                                                                >
                                                                                    Sửa
                                                                                </CButton>
                                                                                {/* <CButton
                                                                                    color='success'
                                                                                    variant="outline"
                                                                                    onClick={() => handleEditClick(data._id)}
                                                                                >
                                                                                    Process
                                                                                </CButton> */}
                                                                            </p>
                                                                        </CTableDataCell>
                                                                    }
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
                </>}
            <ToastContainer />
        </div>
    )
}

export default ManageTheses
