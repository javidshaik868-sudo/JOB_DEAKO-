import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Avatar } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { PageHeader, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { profileApi } from '../../services/profileApi';

export const ProfilePage = () => {
  const { data: profile, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  if (isLoading) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton width="180px" height="2rem" />
        <Card>
          <Skeleton width="100%" height="220px" />
        </Card>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <ErrorState
          title="Could not load profile"
          description={error?.message || 'Failed to fetch candidate profile data.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const experience = profile.experience || [];
  const projects = profile.projects || [];
  const education = profile.education || [];
  const isFresher = Boolean(profile.isFresher) || experience.length === 0;

  return (
    <div className="candidate-profile-page">
      <PageHeader
        title="My Profile"
        subtitle="Manage your professional identity and career details."
        actions={
          <Link to="/app/profile/edit">
            <Button variant="primary" size="md" leftIcon={<Icon name="edit" size={16} />}>
              Edit Profile
            </Button>
          </Link>
        }
      />

      {/* Hero Profile Card */}
      <Card id="profile" style={{ padding: '1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Profile</h3>
          <Link to="/app/profile/edit#profile" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        <div className="profile-hero-layout" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="profile-hero-identity" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Avatar className="profile-hero-avatar" src={profile.avatar} name={profile.name} size="xxl" />
            <div className="profile-hero-copy">
              <h2 className="profile-hero-name" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {profile.name}
              </h2>
              <p className="profile-hero-role" style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 600, margin: '0.25rem 0' }}>
                {profile.title || 'Software Engineer'}
              </p>
              <div className="profile-hero-meta" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Icon name="location" size={14} /> {profile.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Icon name="mail" size={14} /> {profile.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Icon name="clock" size={14} /> Notice: {profile.noticePeriod || 'Immediate'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/app/resume-builder">
              <Button variant="secondary" size="sm" leftIcon={<Icon name="resume" size={14} />}>
                Build Resume
              </Button>
            </Link>
          </div>
        </div>

      </Card>

      <Card id="summary" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Profile Summary</h3>
          <Link to="/app/profile/edit#summary" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        <p className="profile-section-copy">{profile.bio || 'Add a short summary about your professional background and goals.'}</p>
      </Card>

      <Card id="skills" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Skills</h3>
          <Link to="/app/profile/edit#skills" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {profile.skills?.length ? profile.skills.map((skill) => (
            <Badge key={skill} variant="emerald" size="md">
              {skill}
            </Badge>
          )) : <p className="profile-section-copy">No skills added yet.</p>}
        </div>
      </Card>

      <Card id="projects" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Projects</h3>
          <Link to="/app/profile/edit#projects" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        {projects.length === 0 ? (
          <p className="profile-section-copy">No projects added yet.</p>
        ) : (
          <div className="profile-section-list">
            {projects.map((project, index) => (
              <div className="profile-project-row" key={project.id || `${project.title}-${index}`}>
                <div className="profile-project-heading">
                  <h4>{project.title || 'Untitled project'}</h4>
                  <Badge variant={project.status === 'Completed' ? 'emerald' : project.status === 'On Hold' ? 'amber' : 'sky'} size="sm">
                    {project.status || 'In Progress'}
                  </Badge>
                </div>
                {project.description && <p>{project.description}</p>}
                {project.tech && <span className="profile-project-tech">Technologies: {project.tech}</span>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card id="resume" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Resume</h3>
          <Link to="/app/profile/edit#resume" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        {profile.resumeUrl ? (
          <a className="profile-resume-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            <Icon name="resume" size={18} />
            <span>{profile.resumeName || 'View resume'}</span>
            <Icon name="external-link" size={14} />
          </a>
        ) : (
          <p className="profile-section-copy">No resume link added yet.</p>
        )}
      </Card>

      <Card id="education" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Education Details</h3>
          <Link to="/app/profile/edit#education" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
        </div>
        {education.length === 0 ? (
          <p className="profile-section-copy">No education details added yet.</p>
        ) : (
          <div className="profile-section-list">
            {education.map((item, index) => (
              <div className="profile-detail-row" key={item.id || `${item.degree}-${index}`}>
                <h4>{item.degree}</h4>
                <p>{item.institution}</p>
                <span>{[item.period, item.grade].filter(Boolean).join(' · ')}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card id="experience" style={{ padding: '1.5rem 1.75rem' }}>
        <div className="profile-section-heading">
          <h3>Experience</h3>
          <div className="profile-section-heading-actions">
            {isFresher && <Badge variant="sky" size="sm">Fresher</Badge>}
            <Link to="/app/profile/edit#experience" className="profile-section-edit"><Icon name="edit" size={14} /><span>Edit</span></Link>
          </div>
        </div>
        {isFresher ? (
          <p className="profile-section-copy">Fresher · No work experience added yet.</p>
        ) : (
          <div className="profile-section-list">
          {experience.map((exp, index) => (
            <div
              className="profile-detail-row"
              key={exp.id || `${exp.role}-${index}`}
            >
              <div className="profile-detail-row-heading"><h4>{exp.role}</h4><span>{exp.period}</span></div>
              <p>{[exp.company, exp.location].filter(Boolean).join(' · ')}</p>
              {exp.description && <span>{exp.description}</span>}
            </div>
          ))}
          </div>
        )}
      </Card>
    </div>
  );
};
export default ProfilePage;
