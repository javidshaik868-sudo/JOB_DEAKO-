import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Checkbox } from '../../components/common/Input';
import { PageHeader, Tabs } from '../../components/common/Feedback';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    recruiterMessages: true,
    applicationUpdates: true,
    weeklyNewsletter: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    hideFromCurrentEmployer: true,
  });

  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    toast.success('Settings preferences saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    toast.info('Account deleted. Redirecting...');
    setIsDeleteModalOpen(false);
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'account', label: 'Account & Credentials' },
    { id: 'notifications', label: 'Notification Preferences' },
    { id: 'privacy', label: 'Privacy & Visibility' },
    { id: 'security', label: 'Security & 2FA' },
  ];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your account security, communications, and profile discovery preferences"
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Account Tab */}
      {activeTab === 'account' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            Account Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input label="Registered Name" defaultValue={user?.name || 'Priya Sharma'} />
            <Input label="Login Email" defaultValue={user?.email || 'demo@jobdheko.local'} disabled />
          </div>

          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Change Password
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <Input label="Current Password" type="password" placeholder="••••••••••••" />
              <Input label="New Password" type="password" placeholder="Min. 8 characters" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="primary" size="md" onClick={handleSaveSettings}>
              Save Account Changes
            </Button>
          </div>

          {/* Danger Zone */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-error)', margin: 0 }}>
              Danger Zone
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 1rem' }}>
              Permanently delete your JobDheko account, candidate profile, and all active job applications.
            </p>
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            Communication Channels
          </h3>

          <Checkbox
            label="Instant email alerts for new matching jobs"
            checked={notifications.jobAlerts}
            onChange={(e) => setNotifications({ ...notifications, jobAlerts: e.target.checked })}
          />

          <Checkbox
            label="Direct messages from recruiters & talent leads"
            checked={notifications.recruiterMessages}
            onChange={(e) => setNotifications({ ...notifications, recruiterMessages: e.target.checked })}
          />

          <Checkbox
            label="Application tracking milestones & status updates"
            checked={notifications.applicationUpdates}
            onChange={(e) => setNotifications({ ...notifications, applicationUpdates: e.target.checked })}
          />

          <Checkbox
            label="Weekly tech industry digest and compensation insights"
            checked={notifications.weeklyNewsletter}
            onChange={(e) => setNotifications({ ...notifications, weeklyNewsletter: e.target.checked })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="primary" size="md" onClick={handleSaveSettings}>
              Update Notifications
            </Button>
          </div>
        </Card>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            Candidate Privacy & Visibility
          </h3>

          <Checkbox
            label="Allow verified recruiters to view my full candidate profile"
            checked={privacy.profileVisible}
            onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
          />

          <Checkbox
            label="Hide my profile from my current registered employer"
            checked={privacy.hideFromCurrentEmployer}
            onChange={(e) => setPrivacy({ ...privacy, hideFromCurrentEmployer: e.target.checked })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="primary" size="md" onClick={handleSaveSettings}>
              Save Privacy Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            Two-Factor Authentication (2FA)
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Add an extra layer of defense to your JobDheko account using an authenticator app (Google Authenticator, Authy).
          </p>

          <Button variant="secondary" size="md" onClick={() => toast.info('2FA setup initiated')} style={{ width: 'fit-content' }}>
            Enable Authenticator 2FA
          </Button>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-error)', margin: 0 }}>
            This action cannot be undone. All your resumes, applications, and saved preferences will be wiped permanently.
          </p>
          <Input
            label="Type DELETE to confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" size="md" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteAccount}>
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SettingsPage;
