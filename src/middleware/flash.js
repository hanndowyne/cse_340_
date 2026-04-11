/**
 * Custom Flash Message Middleware
 * Stores messages in session and makes them available in templates
 */

const flash = (req, res, next) => {
    // Initialize flash storage if it doesn't exist
    if (!req.session.flash) {
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
    }

    /**
     * Flash function
     * - Set: req.flash(type, message)
     * - Get all: req.flash()
     */
    req.flash = (type, message) => {

        // SET message
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return;
        }

        // GET all messages
        const messages = req.session.flash;

        // Clear after reading
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return messages;
    };

    // Make messages available in ALL views
    res.locals.messages = req.flash();

    next();
};

export default flash;