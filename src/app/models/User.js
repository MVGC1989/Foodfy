const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')
const Recipe = require('../models/Recipe')


Base.init({table: 'users'})

module.exports = {
    ...Base,    

    async delete(id) {
        try {
            const recipesResults = await db.query(
                `
            SELECT recipes.*, recipe_id, file_id
            FROM recipes
            LEFT JOIN recipes_files ON (recipes.id = recipes_files.recipe_id)
            WHERE recipes.user_id = $1
            `, [id]
            )
            const recipes = recipesResults.rows

            let files = await Promise.all(recipes.map(async recipe => {

                const results = await db.query(
                    `
                SELECT *
                FROM files
                WHERE files.id = $1
                `, [recipe.file_id])

                return results.rows[0]
            }))

            files.map(async file => {
                fs.unlinkSync(`${file.path}`)
            })

            await db.query(`
            DELETE FROM users
            WHERE id = $1
            `, [id])

            return

    }catch (err) {
            console.error(err)
        }

    },


    async paginate(params) {
        const { limit, offset } = params
        
        const query = `
        SELECT *, (
            SELECT count(*) FROM users
        ) AS total
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `

        return db.query(query, [limit, offset])
        
    },

}

