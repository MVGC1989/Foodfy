async function post(req, res, next) {
    try {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.render("admin/chefs/create", {
                    chef:req.body,
                    error: "Por favor preencha todos os campos!"
                })
            }    
        }

        if (!req.files || req.files.length == 0){
            return res.render("admin/chefs/create", {
                chef:req.body,
                error: "Envie pelo menos uma imagem!"
            })
        }

    } catch (error) {
        console.error(error)
    }
}

async function update(req, res, next) {
    try {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Por favor, preencha todos os campos!")
            }    
        }
        next()

    } catch (error) {
        console.error();
    }
}

module.exports = {
    post,
    update
}