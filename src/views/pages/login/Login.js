import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';
import API_URL from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const isLoggedIn = localStorage.getItem('isLogin');

  if (isLoggedIn) {
    window.location.href = '/';
  }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (username === '' || password === '') {
        toast('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      if (password.length < 8) {
        toast('Vui lòng nhập mật khẩu với ít nhất 8 kí tự');
        return;
      }
      const response = await axios.post(`${API_URL}/api/users/login`, { username, password });

      if (response.status === 200) {
        console.log(response);
        localStorage.setItem('id', response.data.student_teacher._id);
        localStorage.setItem('user_id', response.data.user._id);
        localStorage.setItem('username', response.data.user.UserName);
        localStorage.setItem('fullname', response.data.student_teacher.FullName);
        localStorage.setItem('email', response.data.student_teacher.Email);
        localStorage.setItem('address', response.data.student_teacher.Address);
        localStorage.setItem('phone', response.data.student_teacher.Phone);
        localStorage.setItem('role', response.data.user.Role);
        localStorage.setItem('dateOfBirth', response.data.student_teacher.DateOfBirth);
        localStorage.setItem('department', response.data.student_teacher.DepartmentID.DepartmentName);
        localStorage.setItem('department_id', response.data.student_teacher.DepartmentID._id);
        if (response.data.user.Role == "student") {
          localStorage.setItem('student_id', response.data.student_teacher._id);
          localStorage.setItem('academicYear', response.data.student_teacher.YearID.YearName);
          localStorage.setItem('academicYear_id', response.data.student_teacher.YearID._id);
        }
        else {
          localStorage.setItem('position', response.data.student_teacher.Position);
          localStorage.setItem('teacher_id', response.data.student_teacher._id);
        }
        localStorage.setItem('isLogin', true);
        toast('Đăng nhập thành công');
        window.location.href = '/';
      }
      else {
        toast('Đăng nhập không thành công');
      }
    } catch (error) {
      console.log(error)
      toast(error.response.data.message);
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password} onChange={e => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  )
}

export default Login
