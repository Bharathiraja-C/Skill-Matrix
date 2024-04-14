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
final AS (

    SELECT Designation , count(Designation) AS DesignationCount
    FROM Users
    group by Designation
    
)

SELECT * from final