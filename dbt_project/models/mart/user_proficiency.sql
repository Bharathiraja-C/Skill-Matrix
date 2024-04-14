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
user_skills AS ( 

    SELECT
        u.UserId AS UserId,
        u.Name,
        s.skillname,
        s.proficiencylevel,
        ROW_NUMBER() OVER (PARTITION BY u.UserId ORDER BY CASE s.proficiencylevel
            WHEN 'Advanced' THEN 1
            WHEN 'Intermediate' THEN 2
            ELSE 3
            END) AS proficiency_rank
    FROM
        stg_users u
    LEFT JOIN
        stg_skills s ON u.UserId = s.UserId
),

final AS (

    SELECT
        UserId,
        Name,
        skillname,
        proficiencylevel
    FROM
        user_skills
    WHERE
        proficiency_rank = 1
)

SELECT * from final