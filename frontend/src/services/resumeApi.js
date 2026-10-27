import { api } from './api';

export const resumeApi = {
  async getResumeData() {
    try {
      return await api.get('/resume');
    } catch (err) {
      if (import.meta.env.DEV) {
        const saved = localStorage.getItem('jobdheko_dev_resume');
        if (saved) return JSON.parse(saved);
        return {
          documentTitle: 'Untitled Resume',
          documentHtml: '',
          personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
          },
          summary: '',
          experience: [],
          education: [],
          skills: [],
        };
      }
      throw err;
    }
  },

  async saveResumeData(data) {
    try {
      return await api.put('/resume', data);
    } catch (err) {
      if (import.meta.env.DEV) {
        localStorage.setItem('jobdheko_dev_resume', JSON.stringify(data));
        return { success: true, data };
      }
      throw err;
    }
  },

  async analyzeResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    try {
      return await api.post('/resume/analyze', formData);
    } catch (err) {
      if (import.meta.env.DEV) {
        // Return realistic ATS analysis output
        return {
          fileName: file?.name || 'resume.pdf',
          overallScore: 84,
          status: 'Strong Candidate',
          categories: [
            { name: 'ATS Compatibility', score: 92, status: 'pass' },
            { name: 'Keyword Alignment', score: 81, status: 'good' },
            { name: 'Quantified Impact', score: 78, status: 'needs-improvement' },
            { name: 'Formatting & Layout', score: 90, status: 'pass' },
          ],
          matchingSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'RESTful APIs'],
          missingKeywords: ['Kubernetes', 'CI/CD Pipelines', 'System Architecture', 'Kafka'],
          suggestions: [
            'Add measurable outcomes to your latest role (e.g., % improvement, revenue impact).',
            'Include cloud orchestration terms like Kubernetes or Terraform.',
            'Maintain single-column formatting for top ATS scanner readability.',
          ],
        };
      }
      throw err;
    }
  },
};
