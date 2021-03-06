const db = require("../../config/db")
const {date} = require('../../lib/utils')
const fs = require('fs')


module.exports = {
    all() {
      try {
        return db.query(`
          SELECT chefs.*, count(recipes) AS total_recipes
          FROM chefs
          LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
          GROUP BY chefs.id
          ORDER BY chefs.name ASC`
        )
      } 
      catch (err) {
        console.error(err)
      }
    },
  
    create(data , file_id) {
      try {
        const query = `
          INSERT INTO chefs (
            name,
            file_id,
            created_at
          ) VALUES ($1, $2, $3)
          RETURNING id
        `
  
        const values = [
          data.name,
          file_id,
          date(Date.now()).iso
        ]
  
        return db.query(query, values)
      } 
      catch (err) {
        console.error(err)
      }
    },
  
    find(id) {
      try {
        return db.query(`
          SELECT chefs.*, count(recipes.*) AS total_recipes
          FROM chefs
          LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
          WHERE chefs.id = $1
          GROUP BY chefs.id`, [id]
        ) 
      } 
      catch (err) {
        console.error(err)
      }
    },
  
    findRecipesByChef(id) {
      try {
        return db.query(`
          SELECT recipes.*, chefs.name AS chef_name
          FROM recipes
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)
          WHERE chefs.id = $1
          ORDER BY created_at DESC`, [id]
        )
      } 
      catch (err) {
        console.error(err)
      }
    },
  
    update(data, file_id) {
      try {
        const query = `
          UPDATE chefs SET
            name=($1),
            file_id=($2)
          WHERE id = $3
        `
  
        const values = [
          data.name,
          file_id,
          data.id
        ]
  
        return db.query(query, values)   
      } 
      catch (err) {
        console.error(err)
      }
    },

    update_name(data) {
      const query = `
      UPDATE chefs SET
      name = ($1)
      WHERE id = $2
      `
      const values = [
        data.name,
        data.id
      ]
  
      return db.query(query, values)
    },
  
    async delete(id) {
      try {
        const results = await db.query(`
          SELECT files.* FROM files
          INNER JOIN chefs ON (files.id = chefs.file_id)
          WHERE chefs.id = $1`, [id]
        )
        const removedFiles = results.rows.map( async file => {
          fs.unlinkSync(file.path)
  
          await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
          await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
        })
      }
      catch (err) {
        console.error(err)
      }
    },
  
    files(id) {
      try {
        return db.query(`
          SELECT files.* FROM files
          LEFT JOIN chefs ON (files.id = chefs.file_id)
          WHERE chefs.id = $1`, [id]
        )
      } 
      catch (err) {
        console.error(err)
      }
    },

    paginate(params){
      var { limit, offset } = params

      const query = `
        SELECT chefs.*, (
            SELECT count(*) FROM chefs
        ) AS total,
        count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY chefs.created_at DESC
        LIMIT $1 OFFSET $2`
        
      return db.query(query , [limit, offset])
  },


}

