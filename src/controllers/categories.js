import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory, getCategoriesByProjectId } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// /categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// /category/:id
const showCategoryDetailsPage = async (req, res) => {
    const id = req.params.id;
    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);
    const title = category ? category.name : 'Category Not Found';
    res.render('category', { title, category, projects });
};

// /assign-categories/:projectId
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';
    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// SHOW create category page
const showCreateCategory = (req, res) => {
    const title = 'Create Category';
    res.render('new-category', { title, error: null });
};

// HANDLE create category
const processCreateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const newCategoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creating category');
        res.redirect('/new-category');
    }
};

// VALIDATION
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Must be less than 100 characters')
        .isLength({ min: 3 }).withMessage('Must be at least 3 characters')
];

// SHOW edit category page
const showEditCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await getCategoryById(id);
        if (!category) {
            req.flash('error', 'Category not found');
            return res.redirect('/categories');
        }
        const title = `Edit Category: ${category.name}`;
        res.render('edit-category', { category, title, error: null });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error loading category');
        res.redirect('/categories');
    }
};

// HANDLE edit category
const processEditCategory = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${id}`);
    }

    try {
        await updateCategory(id, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating category');
        res.redirect('/categories');
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategory,
    processCreateCategory,
    categoryValidation,
    showEditCategory,
    processEditCategory
};