
{{
    config(
        tags=['mart']
    )
}}

WITH

stg_users AS (

    SELECT

        *

    FROM {{ ref('stg_users') }}

),

stg_skills AS (

    SELECT

        *

    FROM {{ ref('stg_skills') }}

),
stg_projects AS (

    SELECT

        *

    FROM {{ ref('stg_projects') }}

),
stg_certifications AS (

    SELECT

        *

    FROM {{ ref('stg_certifications') }}

),
user_engagement AS
(SELECT
    u.UserId,
    u.Name,
    COUNT(DISTINCT p.ProjectId) AS total_projects,
    COUNT(DISTINCT s.SkillId) AS total_skills,
    COUNT(DISTINCT c.CertificationId) AS total_certifications,
    (total_projects * 0.4) + (total_skills * 0.3) + (total_certifications * 0.3) AS engagement_score
FROM
    stg_users u
LEFT JOIN stg_projects p ON u.UserId = p.UserId
LEFT JOIN stg_skills s ON u.UserId = s.UserId
LEFT JOIN stg_certifications c ON u.UserId = c.UserId
GROUP BY
    u.UserId, u.Name
order by engagement_score desc
),
final   AS (
    SELECT
        ue.UserId,
        ue.Name,
        ue.total_projects,
        ue.total_skills,
        ue.total_certifications,
        ue.engagement_score,
        u.emailId,
        u.address,
        u.phone,
        u.role,
        u.designation,
        u.data_loaded_at
    FROM
        user_engagement ue
    LEFT JOIN
        stg_users u
    ON
        ue.UserId = u.UserId
)


SELECT * from final