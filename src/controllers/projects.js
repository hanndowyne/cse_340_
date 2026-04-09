import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { updateProject } from '../models/projects.js';
import { getUserVolunteeredProjects, addVolunteer, removeVolunteer } from '../models/volunteers.js';
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// /projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', {
        title,
        projects
    });
}


const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(id);
    const title = project ? project.title : 'Project Not Found';

    let isVolunteer = false;

    if (req.session.user) {
        const userId = req.session.user.user_id;
        const userProjects = await getUserVolunteeredProjects(userId);
        isVolunteer = userProjects.some(p => p.project_id === project.project_id);
    }

    res.render('project', {
        project,
        categories,
        title,
        session: req.session,   // <-- pass session to EJS
        isVolunteer             // <-- pass isVolunteer flag
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash('error', 'Project not found');
            return res.redirect('/projects');
        }

        // Convert date to a Date object for EJS
        project.project_date = project.date ? new Date(project.date) : null;

        const organizations = await getAllOrganizations();

        // Pass title so header.ejs works
        const title = `Edit Project: ${project.title}`;

        res.render('edit-project', { project, organizations, title });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error loading project');
        res.redirect('/projects');
    }
};


const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    // Server-side validation
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/projects');
    }
};


// POST /project/:id/volunteer
const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not volunteer. Please try again.');
        res.redirect(`/project/${projectId}`);
    }
};

// POST /project/:id/unvolunteer
const unvolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You are no longer volunteering for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not remove volunteer. Please try again.');
        res.redirect(`/project/${projectId}`);
    }
};

export { showProjectsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, volunteerForProject, unvolunteerFromProject, showProjectDetailsPage };
