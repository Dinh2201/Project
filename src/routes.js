import React from 'react'

//admin
const ManageStudent = React.lazy(() => import('./views/pages/manageStudent/manage_student'))
const ManageTeacher = React.lazy(() => import('./views/pages/manageTeacher/manage_teacher'))
const ManageProjectRegistrationPeriod = React.lazy(() => import('./views/pages/manageProjectRegistrationPeriod/manage_project_registration_period'))
const ManageTheses = React.lazy(() => import('./views/pages/manangeTheses/manage_theses'))
const ManageAcademicYear = React.lazy(() => import('./views/pages/manageAcademicYear/manage_academic_year'))
const ManageDepartment = React.lazy(() => import('./views/pages/manageDepartment/manage_department'))
const ManageProfile = React.lazy(() => import('./views/pages/manageProfile/manage_profile'))
const RegisterTheses = React.lazy(() => import('./views/pages/registerTheses/register_theses'))
const ManageTasksProgress = React.lazy(() => import('./views/pages/manageTasksAndProgress/manage_tasks_and_progress'))
const Logout = React.lazy(() => import('./views/pages/logout/logout'))
const ManageThesesInfo = React.lazy(() => import('./views/pages/manageThesisInfo/manage_thesis_info'))
const ManageTasksProgressStudent = React.lazy(() => import('./views/pages/manageTasksAndProgress/manage_tasks_and_progress_student'))

const routes = [
  { path: '/', exact: true },
  { path: '/manage-student', name: 'Quản lí sinh viên', element: ManageStudent },
  { path: '/manage-teacher', name: 'Quản lí giảng viên', element: ManageTeacher },
  { path: '/manage-project-registration-period', name: 'Quản lí đợt đăng kí đề tài', element: ManageProjectRegistrationPeriod },
  { path: '/manage-theses', name: 'Quản lí đề tài', element: ManageTheses },
  { path: '/manage-academic-year', name: 'Quản lí niên khóa', element: ManageAcademicYear },
  { path: '/manage-department', name: 'Quản lí chuyên ngành', element: ManageDepartment },
  { path: '/manage-profile', name: 'Thông tin tài khoản', element: ManageProfile },
  { path: '/register-theses', name: 'Đăng kí đề tài', element: RegisterTheses },
  { path: '/manage-tasks-progress', name: 'Quản lý yêu cầu và tiến độ', element: ManageTasksProgress },
  { path: '/logout', name: 'Đăng xuất', element: Logout },
  { path: '/manage-theses-info', name: 'Đề tài của bạn', element: ManageThesesInfo },
  { path: '/manage-tasks-progress-student', name: 'Quản lý yêu cầu và tiến độ', element: ManageTasksProgressStudent },

]

export default routes
