import db from './db.js'
import pool from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id,name
      FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name as category_name
        FROM public.categories c
        JOIN public.project_categories pc 
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};


const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description,
               sp.location, sp.project_date
        FROM public.service_projects sp
        JOIN public.project_categories pc 
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date ASC;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// create category
const createCategory = async (name) => {
    const result = await db.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING category_id',
        [name]
    );
    return result.rows[0].category_id;
};

// update category
const updateCategory = async (id, name) => {
    const result = await db.query(
        'UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING category_id',
        [name, id]
    );
    if (!result.rows[0]) throw new Error('Category not found');
    return result.rows[0].category_id;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory }