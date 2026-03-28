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
      o.name AS organization_name
    FROM service_projects sp
    JOIN organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};


export {  getAllProjects,getProjectsByOrganizationId, getProjectById, getUpcomingProjects, getProjectDetails};
