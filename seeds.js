const { hash } = require('bcryptjs')
const faker = require('faker')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/Files')
const Recipe = require('./src/app/models/Recipe')
const Base = require('./src/app/models/Base')

let usersIds = []
let chefsIds = []
let filesIds = []
let recipesIds= []
let totalUsers = 5
let totalChefs = 4
let totalRecipes = 10
let totalFiles = totalChefs + totalRecipes

async function createUsers() {
    const users = []
    const password = await hash('123', 8)

    while (users.length < totalUsers) {

        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: faker.random.boolean(Math.random())
        })
    }

    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
    const chefs = []

    for (let i = 1; chefs.length < totalChefs; i++) {

        chefs.push({
            name: faker.name.firstName(),
            file_id:[i]
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)
}

async function createFiles() {
    let files = []

    while (files.length < totalFiles) {
        files.push({
            name: faker.image.image(),
            path: `/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)
}

async function createRecipes() {

    let recipes = []
    let array = []

    while(array.length < 2) {
        array.push(faker.random.words(1))
    }

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: Math.ceil(Math.random() * totalChefs),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: array,
            preparation: array,
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 5))
        })

    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

}

async function createRecipesFiles() {
    const relations = []
    let recipesCount = 0

    for (let i = totalChefs + 1; relations.length < totalRecipes; i++) {
        recipesCount++

        relations.push({
            recipe_id: recipesCount,
            file_id: i
        })
    }

    const relationsPromises = relations.map(relation => {
        Base.init({
            table: 'recipes_files'
        })

        Base.create(relation)
    })

    await Promise.all(relationsPromises)
}

async function init() {      

    await createUsers()
    await createFiles()
    await createChefs()
    await createRecipes()
    await createRecipesFiles()
}

init()