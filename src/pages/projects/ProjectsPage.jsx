import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

import ProjectList from '../../components/projects/ProjectList';
import ProjectDetail from '../../components/projects/ProjectDetail';
import ProjectDashboard from '../../components/projects/ProjectDashboard';
import { CreateProject, EditProject } from '../../components/projects/ProjectForm';
import { CreateTask, EditTask } from '../../components/projects/TaskForm';
import { projectService } from '../../services/project.service';

// Project detail wrapper with loading data
const ProjectDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await projectService.getProjectById(id);
        setProject(response.data.project);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [id]);
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  // Show not found state
  if (!project) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" gutterBottom>
          Project Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The project you are looking for does not exist or has been deleted.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
        </Box>
      </Box>
    );
  }
  
  return <ProjectDetail project={project} />;
};

// Edit project wrapper with loading data
const EditProjectWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await projectService.getProjectById(id);
        setProject(response.data.project);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [id]);
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  // Show not found state
  if (!project) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" gutterBottom>
          Project Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The project you are looking for does not exist or has been deleted.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
        </Box>
      </Box>
    );
  }
  
  return <EditProject project={project} />;
};

// Main projects page component with routing
const ProjectsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectList />} />
      <Route path="/dashboard" element={<ProjectDashboard />} />
      <Route path="/new" element={<CreateProject />} />
      <Route path="/:id" element={<ProjectDetailWrapper />} />
      <Route path="/:id/edit" element={<EditProjectWrapper />} />
      <Route path="/:projectId/tasks/new" element={<CreateTask />} />
      <Route path="/:projectId/tasks/:taskId/edit" element={<EditTask />} />
    </Routes>
  );
};

export default ProjectsPage;