{{
    config(
        tags=['basic', 'staging']
    )
}}


WITH

required_fields AS (

    SELECT

        id                  AS CertificationId
        , user_id           AS UserId
        , skill_id          AS SkillId
        , certificationname AS CertificationName
        , certificationfile AS CertificationFile
        , issueddate        AS IssuedDate
        , expirydate        AS ExpiryDate
        , status            AS Status
    FROM {{ source('Skill_Matrix', 'Certification') }}

),
datatype_conversion AS (

    SELECT 
    CAST(CertificationId AS VARCHAR)      AS CertificationId,
    CAST(UserId AS VARCHAR)               AS UserId,
    CAST(SkillId AS VARCHAR)              AS SkillId,
    CertificationName,
    CertificationFile,
    TO_DATE(IssuedDate)                   AS IssuedDate,
    TO_DATE(ExpiryDate)                   AS ExpiryDate,
    Status
    
    FROM required_fields

),

add_aggregate_field AS (

    SELECT 

        *
        , {{ var('dat') }}                         AS data_loaded_at

    FROM datatype_conversion

)

SELECT * FROM add_aggregate_field