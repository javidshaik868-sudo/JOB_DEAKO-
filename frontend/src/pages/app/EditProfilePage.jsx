import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Card } from '../../components/common/Card';
import { Input, Textarea, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { PageHeader } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { profileApi } from '../../services/profileApi';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const SectionCard = ({ id, title, description, action, children }) => (
  <Card id={id} className="profile-edit-section" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
    <div className="profile-edit-section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </Card>
);

const createEntry = (section) => ({
  id: `${section}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  ...(section === 'experience' ? { role: '', company: '', location: '', period: '', description: '' } : {}),
  ...(section === 'education' ? { degree: '', institution: '', period: '', grade: '' } : {}),
  ...(section === 'projects' ? { title: '', description: '', tech: '', status: 'In Progress' } : {}),
});

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { updateUserProfile } = useAuth();

  const { data: initialProfile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
    noticePeriod: '30 Days',
    skills: '',
    isFresher: true,
    experience: [],
    education: [],
    projects: [],
    resumeName: '',
    resumeUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (!initialProfile) return;
    const experience = initialProfile.experience || [];
    setFormData({
      name: initialProfile.name || '',
      avatar: initialProfile.avatar || '',
      title: initialProfile.title || '',
      bio: initialProfile.bio || '',
      phone: initialProfile.phone || '',
      location: initialProfile.location || '',
      noticePeriod: initialProfile.noticePeriod || '30 Days',
      skills: initialProfile.skills?.join(', ') || '',
      isFresher: typeof initialProfile.isFresher === 'boolean' ? initialProfile.isFresher : experience.length === 0,
      experience,
      education: initialProfile.education || [],
      projects: (initialProfile.projects || []).map((project) => ({
        ...project,
        status: project.status || 'In Progress',
      })),
      resumeName: initialProfile.resumeName || '',
      resumeUrl: initialProfile.resumeUrl || '',
    });
  }, [initialProfile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  useEffect(() => {
    if (isLoading || !location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, location.hash]);

  const updateMutation = useMutation({
    mutationFn: async (updated) => {
      const profileToSave = avatarFile
        ? { ...updated, avatar: (await profileApi.uploadAvatar(avatarFile)).avatarUrl || updated.avatar }
        : updated;
      await profileApi.updateProfile(profileToSave);
      return profileToSave;
    },
    onSuccess: (updatedProfile) => {
      toast.success('Profile updated successfully.');
      setAvatarFile(null);
      updateUserProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/app/profile');
    },
    onError: (err) => toast.error(err.message || 'Failed to update profile.'),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleEntryChange = (section, index, name, value) => {
    setFormData((previous) => ({
      ...previous,
      [section]: previous[section].map((entry, entryIndex) => (
        entryIndex === index ? { ...entry, [name]: value } : entry
      )),
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file for your profile photo.');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Profile photos must be 2MB or smaller.');
      event.target.value = '';
      return;
    }
    setAvatarFile(file);
  };

  const addEntry = (section) => {
    setFormData((previous) => ({ ...previous, [section]: [...previous[section], createEntry(section)] }));
  };

  const removeEntry = (section, index) => {
    setFormData((previous) => ({
      ...previous,
      [section]: previous[section].filter((_, entryIndex) => entryIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const skills = formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    updateMutation.mutate({
      ...initialProfile,
      avatar: formData.avatar,
      name: formData.name,
      title: formData.title,
      phone: formData.phone,
      location: formData.location,
      noticePeriod: formData.noticePeriod,
      bio: formData.bio,
      skills,
      isFresher: formData.isFresher,
      experience: formData.isFresher ? [] : formData.experience,
      education: formData.education,
      projects: formData.projects,
      resumeName: formData.resumeName,
      resumeUrl: formData.resumeUrl,
    });
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
        <Skeleton width="180px" height="2rem" />
        <Skeleton width="100%" height="300px" />
        <Skeleton width="100%" height="240px" />
      </div>
    );
  }

  return (
    <div className="profile-editor-page">
      <PageHeader
        title="Edit Profile"
        subtitle="Update every section of your professional profile."
      />

      <form className="profile-editor-form" onSubmit={handleSubmit}>
        <SectionCard id="profile" title="Profile" description="Your name, professional headline, and contact details.">
          <div className="profile-photo-editor">
            <Avatar src={avatarPreview || formData.avatar} name={formData.name} size="xxl" />
            <div className="profile-photo-picker-copy">
              <strong>Profile photo</strong>
              <label className="profile-photo-picker">
                <input type="file" accept="image/*" aria-label="Upload profile photo" onChange={handleAvatarChange} />
                <span><Icon name="upload" size={15} /> Choose photo</span>
              </label>
              <small>PNG, JPG, or GIF · up to 2MB</small>
            </div>
          </div>
          <div className="profile-edit-fields-grid">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Professional Headline / Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Full Stack Engineer" />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Hyderabad, India" />
          </div>
          <Select
            label="Notice Period Availability"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            options={[
              { value: 'Immediate', label: 'Immediate' },
              { value: 'Immediate to 15 Days', label: 'Immediate to 15 Days' },
              { value: '30 Days', label: '30 Days' },
              { value: '60 Days', label: '60 Days' },
              { value: '90 Days', label: '90 Days' },
            ]}
          />
        </SectionCard>

        <SectionCard id="summary" title="Profile Summary" description="A concise introduction to your experience and strengths.">
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            placeholder="Summarize your background, strengths, and career goals..."
          />
        </SectionCard>

        <SectionCard id="skills" title="Skills" description="Separate each skill with a comma.">
          <Input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, AWS"
          />
        </SectionCard>

        <SectionCard
          id="projects"
          title="Projects"
          description="Add personal, academic, or professional projects and their current status."
          action={(
            <Button type="button" variant="secondary" size="sm" onClick={() => addEntry('projects')} leftIcon={<Icon name="plus" size={15} />}>
              Add Project
            </Button>
          )}
        >
          {formData.projects.length === 0 ? (
            <p className="profile-editor-empty-copy">No projects added yet.</p>
          ) : formData.projects.map((project, index) => (
            <div className="profile-editor-entry" key={project.id || `project-${index}`}>
              <div className="profile-editor-fields-row">
                <Input
                  label="Project Name"
                  value={project.title || ''}
                  onChange={(event) => handleEntryChange('projects', index, 'title', event.target.value)}
                />
                <Select
                  label="Project Status"
                  value={project.status || 'In Progress'}
                  onChange={(event) => handleEntryChange('projects', index, 'status', event.target.value)}
                  options={[
                    { value: 'Planned', label: 'Planned' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'On Hold', label: 'On Hold' },
                    { value: 'Completed', label: 'Completed' },
                  ]}
                />
              </div>
              <Textarea
                label="Description"
                rows={3}
                value={project.description || ''}
                onChange={(event) => handleEntryChange('projects', index, 'description', event.target.value)}
              />
              <div className="profile-editor-entry-footer">
                <Input
                  label="Technologies"
                  value={project.tech || ''}
                  onChange={(event) => handleEntryChange('projects', index, 'tech', event.target.value)}
                  placeholder="React, Python, FastAPI"
                />
                <button type="button" className="profile-remove-entry" aria-label={`Remove project ${index + 1}`} onClick={() => removeEntry('projects', index)}>
                  <Icon name="delete" size={17} />
                </button>
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard id="resume" title="Resume" description="Add a link to your resume so it can be opened from your profile.">
          <div className="profile-edit-fields-row">
            <Input
              label="Resume Name"
              name="resumeName"
              value={formData.resumeName}
              onChange={handleChange}
              placeholder="e.g. Priya-Sharma-Resume.pdf"
            />
            <Input
              label="Resume URL"
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </SectionCard>

        <SectionCard
          id="education"
          title="Education Details"
          description="Add your degrees, institutions, and completion details."
          action={(
            <Button type="button" variant="secondary" size="sm" onClick={() => addEntry('education')} leftIcon={<Icon name="plus" size={15} />}>
              Add Education
            </Button>
          )}
        >
          {formData.education.length === 0 ? (
            <p className="profile-editor-empty-copy">No education details added yet.</p>
          ) : formData.education.map((education, index) => (
            <div className="profile-editor-entry" key={education.id || `education-${index}`}>
              <div className="profile-editor-fields-row">
                <Input label="Degree" value={education.degree || ''} onChange={(event) => handleEntryChange('education', index, 'degree', event.target.value)} />
                <Input label="Institution" value={education.institution || ''} onChange={(event) => handleEntryChange('education', index, 'institution', event.target.value)} />
              </div>
              <div className="profile-editor-entry-footer">
                <div className="profile-editor-fields-row">
                  <Input label="Period" value={education.period || ''} onChange={(event) => handleEntryChange('education', index, 'period', event.target.value)} placeholder="2020 - 2024" />
                  <Input label="Grade" value={education.grade || ''} onChange={(event) => handleEntryChange('education', index, 'grade', event.target.value)} />
                </div>
                <button type="button" className="profile-remove-entry" aria-label={`Remove education ${index + 1}`} onClick={() => removeEntry('education', index)}>
                  <Icon name="delete" size={17} />
                </button>
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          id="experience"
          title="Experience"
          description="Add roles you have held, or mark your profile as Fresher."
          action={!formData.isFresher && (
            <Button type="button" variant="secondary" size="sm" onClick={() => addEntry('experience')} leftIcon={<Icon name="plus" size={15} />}>
              Add Experience
            </Button>
          )}
        >
          <label className="profile-fresher-toggle">
            <input
              type="checkbox"
              checked={formData.isFresher}
              onChange={(event) => setFormData((previous) => ({ ...previous, isFresher: event.target.checked }))}
            />
            <span>I am a fresher (no work experience yet)</span>
          </label>
          {formData.isFresher ? (
            <p className="profile-editor-empty-copy">Your profile will display Fresher in the experience section.</p>
          ) : formData.experience.length === 0 ? (
            <p className="profile-editor-empty-copy">No experience added yet. Add a role or mark yourself as a Fresher.</p>
          ) : formData.experience.map((experience, index) => (
            <div className="profile-editor-entry" key={experience.id || `experience-${index}`}>
              <div className="profile-editor-fields-row">
                <Input label="Role" value={experience.role || ''} onChange={(event) => handleEntryChange('experience', index, 'role', event.target.value)} />
                <Input label="Company" value={experience.company || ''} onChange={(event) => handleEntryChange('experience', index, 'company', event.target.value)} />
              </div>
              <div className="profile-editor-entry-footer">
                <div className="profile-editor-fields-row">
                  <Input label="Location" value={experience.location || ''} onChange={(event) => handleEntryChange('experience', index, 'location', event.target.value)} />
                  <Input label="Period" value={experience.period || ''} onChange={(event) => handleEntryChange('experience', index, 'period', event.target.value)} placeholder="2022 - Present" />
                </div>
                <button type="button" className="profile-remove-entry" aria-label={`Remove experience ${index + 1}`} onClick={() => removeEntry('experience', index)}>
                  <Icon name="delete" size={17} />
                </button>
              </div>
              <Textarea label="Description" rows={3} value={experience.description || ''} onChange={(event) => handleEntryChange('experience', index, 'description', event.target.value)} />
            </div>
          ))}
        </SectionCard>

        <div className="profile-editor-actions">
          <Link to="/app/profile">
            <Button type="button" variant="ghost" size="md">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" size="md" isLoading={updateMutation.isPending} leftIcon={<Icon name="check" size={16} />}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;