
import { list } from "./Services/List.js"
import { create } from "./Services/create.js"


const metodo = process.argv.at(2)

switch (metodo) {
    case 'create': {
        // pass an optional path or JSON string as the 3rd argument
        create(process.argv.at(3))
        break
    }
    case 'list': {
        list()
        break
    }
    default: {
        console.log('metodo não encontrado')
    }

}