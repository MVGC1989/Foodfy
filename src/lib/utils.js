module.exports = {
age: function (timestamp){
    let today = new Date()
    let birthDate = new Date(timestamp) 

    let age = today.getFullYear() - birthDate.getFullYear()

    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()){ 
        age = age -1 
    }
    return age
},
date: function(timestamp){
    const date = new Date(timestamp)
    const year = date.getUTCFullYear() 
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
            birth_day: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
}
}