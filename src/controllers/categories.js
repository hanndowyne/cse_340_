// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);
    const title = category ? category.name : 'Category Not Found';

    res.render('category', { title, category, projects });
};



// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
