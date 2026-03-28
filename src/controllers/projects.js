import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// /projects
export async function showProjectsPage(req, res) {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
}

// /project/:id
export async function showProjectDetailsPage(req, res) {
    const id = req.params.id;
    const project = await getProjectDetails(id);

    res.render('project', {
        title: project.title,
        project
    });
}