import express from 'express';
import { showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './organizations.js';
import { showHomePage } from './index.js';
import { showOrganizationsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showCreateCategory, processCreateCategory, categoryValidation, showEditCategory, processEditCategory } from './categories.js';
import { testErrorPage } from './errors.js';
import { showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './projects.js';
import { showUserRegistrationForm, processUserRegistrationForm } from './users.js';
import { showLoginForm, processLoginForm, processLogout } from './users.js';
import { requireRole } from '../controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);


// error-handling routes
router.get('/test-error', testErrorPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);


// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// CREATE
router.get('/new-category', showCreateCategory);
router.post('/new-category', categoryValidation, processCreateCategory);

router.get('/edit-category/:id', showEditCategory);
router.post('/edit-category/:id', categoryValidation, processEditCategory);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);



// Organizations
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/organization/:id/edit', requireRole('admin'), showEditOrganizationForm);
router.post('/organization/:id/edit', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Projects
router.get('/projects/new', requireRole('admin'), showNewProjectForm);
router.post('/projects/new', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/project/:id/edit', requireRole('admin'), showEditProjectForm);
router.post('/project/:id/edit', requireRole('admin'), projectValidation, processEditProjectForm);

// Categories
router.get('/categories/new', requireRole('admin'), showCreateCategory);
router.post('/categories/new', requireRole('admin'), categoryValidation, processCreateCategory);
router.get('/category/:id/edit', requireRole('admin'), showEditCategory);
router.post('/category/:id/edit', requireRole('admin'), categoryValidation, processEditCategory);

// Assigning categories to projects
router.get('/project/:id/categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:id/categories', requireRole('admin'), processAssignCategoriesForm);


export default router;