{{
    config(
        tags=['basic', 'staging']
    )
}}


WITH

required_fields AS (

    SELECT

        id                  AS UserId
        , username          AS  Name  
        , email             As EmailId 
        , password          AS Password  
        , address           AS Address 
        , phone             As  Phone
        , role              As   Role 
        , designation       As  Designation 

    FROM {{ source('Skill_Matrix', 'Users') }}

),
datatype_conversion AS (
    SELECT 
        UserId,
        Name,
        EmailId,
        Password,
        Address,
        CAST(REPLACE(Phone, '-', '') AS INT) AS Phone,
        Role,
        Designation
    FROM required_fields
)
,
add_aggregate_field AS (

    SELECT 

        *
        , {{ var('dat') }}                         AS data_loaded_at

    FROM datatype_conversion

)


SELECT * FROM add_aggregate_field