import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { Spinner } from '../components/common/Spinner';

// Lazy loading route components for optimal production performance
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const SignInPage = lazy(() => import('../pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));
const VerifyOtpPage = lazy(() => import('../pages/auth/VerifyOtpPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Authenticated Application Screens
const DashboardPage = lazy(() => import('../pages/app/DashboardPage'));
const FindJobsPage = lazy(() => import('../pages/app/FindJobsPage'));
const JobDetailsPage = lazy(() => import('../pages/app/JobDetailsPage'));
const ApplicationSuccessPage = lazy(() => import('../pages/app/ApplicationSuccessPage'));
const SavedJobsPage = lazy(() => import('../pages/app/SavedJobsPage'));
const AppliedJobsPage = lazy(() => import('../pages/app/AppliedJobsPage'));
const ApplicationsPage = lazy(() => import('../pages/app/ApplicationsPage'));
const ApplicationTrackingPage = lazy(() => import('../pages/app/ApplicationTrackingPage'));
const ScheduleInterviewPage = lazy(() => import('../pages/app/ScheduleInterviewPage'));
const ProfilePage = lazy(() => import('../pages/app/ProfilePage'));
const EditProfilePage = lazy(() => import('../pages/app/EditProfilePage'));
const JobAlertsPage = lazy(() => import('../pages/app/JobAlertsPage'));
const NotificationsPage = lazy(() => import('../pages/app/NotificationsPage'));
const CompaniesPage = lazy(() => import('../pages/app/CompaniesPage'));
const CompanyDetailsPage = lazy(() => import('../pages/app/CompanyDetailsPage'));
const CareerResourcesPage = lazy(() => import('../pages/app/CareerResourcesPage'));
const ResumeBuilderPage = lazy(() => import('../pages/app/ResumeBuilderPage'));
const ResumeAnalyzerPage = lazy(() => import('../pages/app/ResumeAnalyzerPage'));
const MessagesPage = lazy(() => import('../pages/app/MessagesPage'));
const SettingsPage = lazy(() => import('../pages/app/SettingsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));

const PageLoader = () => (
  <div className="page-loading-state">
    <Spinner size={32} />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated Application Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="jobs" element={<FindJobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="application-success" element={<ApplicationSuccessPage />} />
          <Route path="saved-jobs" element={<SavedJobsPage />} />
          <Route path="applied-jobs" element={<AppliedJobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:applicationId" element={<ApplicationTrackingPage />} />
          <Route path="applications/:applicationId/schedule" element={<ScheduleInterviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="job-alerts" element={<JobAlertsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="companies/:companyId" element={<CompanyDetailsPage />} />
          <Route path="career-resources" element={<CareerResourcesPage />} />
          <Route path="resume-builder" element={<ResumeBuilderPage />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Handlers */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
