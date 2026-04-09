import { getUserVolunteeredProjects } from '../models/volunteers.js'; // make sure this exists

const showHomePage = async (req, res) => {
    const title = 'Home';

    let volunteeredProjects = [];
    if (req.session.user) {
        // Get projects the logged-in user is volunteering for
        volunteeredProjects = await getUserVolunteeredProjects(req.session.user.user_id);
    }

    res.render('home', {
        title,
        session: req.session,           // pass session to EJS
        volunteeredProjects             // pass the projects list
    });
};

export { showHomePage };