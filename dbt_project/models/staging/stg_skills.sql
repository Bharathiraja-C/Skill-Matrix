{{
    config(
        tags=['basic', 'staging']
    )
}}


WITH

required_fields AS (

    SELECT

        id                  AS SkillId
        , user_id           As UserId
        , skillname         As SkillName
        , proficiencylevel  AS ProficiencyLevel
        , status            AS Status

    FROM {{ source('Skill_Matrix', 'Skills') }}

),


add_aggregate_field AS (

    SELECT 

        *
        , {{ var('dat') }}                         AS data_loaded_at

    FROM required_fields

)


SELECT * FROM add_aggregate_field