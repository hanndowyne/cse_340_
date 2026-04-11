import express from 'express';

import { showHomePage } from './index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategory,
    processCreateCategory,
    categoryValidation,
    showEditCategory,
    processEditCategory
} from './categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showUsersPage,
    requireRole,
    requireLogin
} from './users.js';

import { volunteerForProject, unvolunteerFromProject } from './volunteers.js';

const router = express.Router();


// ================= PUBLIC ROUTES =================

// Home → redirect to dashboard
router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Auth
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Public pages
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);


// ================= LOGIN REQUIRED =================

// Dashboard
router.get('/dashboard', requireLogin, showHomePage);

// Volunteer (must be logged in)
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/unvolunteer', requireLogin, unvolunteerFromProject);


// ================= ADMIN ONLY =================

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

// Assign categories
router.get('/project/:id/categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:id/categories', requireRole('admin'), processAssignCategoriesForm);

// Users page (admin only)
router.get('/users', requireRole('admin'), showUsersPage);


export default router;