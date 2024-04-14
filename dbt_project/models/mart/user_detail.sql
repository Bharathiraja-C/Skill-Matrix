{{
    config(
        tags=['mart']
    )
}}

WITH

users AS (

    SELECT

        *

    FROM {{ ref('stg_users') }}

),

skills AS (

    SELECT

        *

    FROM {{ ref('stg_skills') }}

),
projects AS (

    SELECT

        *

    FROM {{ ref('stg_projects') }}

),
certifications AS (

    SELECT

        *

    FROM {{ ref('stg_certifications') }}

),
final AS (

   SELECT Distinct
		u.UserId as UserId,
        u.Name as UserName,
        s.skillname as SkillName,
        s.proficiencylevel as ProficiencyLevel,
        p.projectname as ProjectName,
        p.projectexperience as ProjectExperience,
        p.ProjectRole as ProjectRole
         FROM
        users as u 
        inner join skills as s on s.UserId=u.UserId
        inner join projects as p on s.SkillId=p.SkillId
      
)

SELECT * FROM final