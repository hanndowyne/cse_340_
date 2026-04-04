import db from './db.js'

const getAllProjects = async () => {
  const query = `
        SELECT project_id, organization_id, title, description, location, project_date
      FROM public.service_projects;
    `;

  const result = await db.query(query);

  return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date AS date
    FROM service_projects sp
    WHERE sp.organization_id = $1
    ORDER BY sp.project_date;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};


const getUpcomingProjects = async (number_of_projects) => {
  const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};


const getProjectById = async (id) => {
  const query = `
    SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.project_date AS date,
        sp.location,
        sp.organization_id,
        o.name AS organization_name
    FROM service_projects sp
    JOIN organization o
        ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT 
      sp.project_id,
      sp.title,
      sp.description,
      sp.project_date AS date,
      sp.location,
      sp.organization_id,
      o.name AS organization_name,
      c.category_id,
      c.name AS category_name
    FROM service_projects sp
    JOIN organization o
      ON sp.organization_id = o.organization_id
    LEFT JOIN project_categories pc
      ON sp.project_id = pc.project_id
    LEFT JOIN categories c
      ON pc.category_id = c.category_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO service_projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const query_params = [title, description, location, date, organizationId];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
}

import { getCategoriesByProjectId } from '../models/categories.js';

const showProjectDetailsPage = async (req, res) => {
  const { id } = req.params;

  const project = await getProjectById(id);
  const categories = await getCategoriesByProjectId(id); // 👈 ADD THIS

  res.render('project', {
    title: project.title,
    project,
    categories   // 👈 PASS THIS
  });
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING *;
    `;

  const values = [title, description, location, date, organizationId, projectId];

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  return result.rows[0];
};


export { getAllProjects, getProjectsByOrganizationId, getProjectById, getUpcomingProjects, getProjectDetails, createProject, showProjectDetailsPage, updateProject };
