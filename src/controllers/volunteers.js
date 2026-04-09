import db from '../models/db.js';

import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user?.user_id;

    if (!userId) {
        req.flash('error', 'You must be logged in to volunteer.');
        return res.redirect('/login');
    }

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error('Error volunteering:', err);
        req.flash('error', 'Could not volunteer for the project. Please try again.');
        res.redirect(`/project/${projectId}`);
    }
};

const unvolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user?.user_id;

    if (!userId) {
        req.flash('error', 'You must be logged in to remove volunteering.');
        return res.redirect('/login');
    }

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error('Error removing volunteer:', err);
        req.flash('error', 'Could not remove volunteering. Please try again.');
        res.redirect(`/project/${projectId}`);
    }
};

const getUserVolunteeredProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.date
        FROM projects p
        JOIN volunteers v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY p.date ASC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};


export { volunteerForProject, unvolunteerFromProject, getUserVolunteeredProjects };