import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilPuzzle,
  cilAccountLogout,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const isLogin = localStorage.getItem('isLogin') || true
const role = localStorage.getItem('role') || 'admin'

var _nav = []
_nav.push(
  {
    component: CNavTitle,
    name: 'CHỨC NĂNG',
  },
)

if (!isLogin) {
  window.location.href = '/'
}

if (role === 'student') {
  _nav.push({
    component: CNavGroup,
    name: 'SINH VIÊN',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đăng kí đề tài',
        to: '/register-theses',
      },
      {
        component: CNavItem,
        name: 'Quản lí yêu cầu tiến độ',
        to: '/manage-tasks-progress',
      },
    ],
  })
}

if (role === 'teacher' || role === 'departmentHead') {
  _nav.push({
    component: CNavGroup,
    name: 'GIẢNG VIÊN - TBM',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lí đề tài',
        to: '/manage-theses',
      },
      {
        component: CNavItem,
        name: 'Quản lí yêu cầu tiến độ',
        to: '/manage-tasks-progress',
      },
    ],
  })
}

if (role === 'admin') {
  _nav.push({
    component: CNavGroup,
    name: 'QUẢN TRỊ',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lí sinh viên',
        to: '/manage-student',
      },
      {
        component: CNavItem,
        name: 'Quản lí giảng viên',
        to: '/manage-teacher',
      },
      {
        component: CNavItem,
        name: 'Quản lí đợt đăng kí',
        to: '/manage-project-registration-period',
      },
      {
        component: CNavItem,
        name: 'Quản lí đề tài',
        to: '/manage-theses',
      },
      {
        component: CNavItem,
        name: 'Quản lí niên khóa',
        to: '/manage-academic-year',
      },
      {
        component: CNavItem,
        name: 'Quản lí chuyên ngành',
        to: '/manage-department',
      },
    ],
  })
}

_nav.push(
  {
    component: CNavTitle,
    name: 'TÀI KHOẢN',
  },
  {
    component: CNavItem,
    name: 'Thông tin tài khoản',
    to: '/manage-profile',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đăng xuất',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
)

export default _nav
