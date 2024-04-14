{{
    config(
        tags=['basic', 'staging']
    )
}}


WITH

required_fields AS (

    SELECT

        id                   AS ProjectId
        , user_id            AS UserId
        , skill_id           As SkillId
        , projectname        AS ProjectName
        , projectdescription AS ProjectDescription
        , projectexperience  AS projectexperience
        , role               AS ProjectRole
        , status             AS Status

    FROM {{ source('Skill_Matrix', 'Project') }}

),


add_aggregate_field AS (

    SELECT 

        *
        , {{ var('dat') }}                         AS data_loaded_at

    FROM required_fields

)

SELECT * FROM add_aggregate_field