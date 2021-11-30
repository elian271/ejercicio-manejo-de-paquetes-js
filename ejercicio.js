// Consigna: Implementar programa que contenga una clase llamada Contenedor que reciba el
// nombre del archivo con el que va a trabajar e implemente los siguientes métodos:
// ● save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
// ● getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
// ● getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
// ● deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
// ● deleteAll(): void - Elimina todos los objetos presentes en el archivo.
// Aspectos a incluir en el entregable:
// - El método save incorporará al producto un id numérico, que deberá ser siempre uno más que el id
// del último objeto agregado (o id 1 si es el primer objeto que se agrega) y no puede estar repetido.
// - Tomar en consideración el contenido previo del archivo, en caso de utilizar uno existente.
// - Implementar el manejo de archivos con el módulo fs de node.js, utilizando promesas con
// async/await y manejo de errores.
// - Probar el módulo creando un contenedor de productos, que se guarde en el archivo:
// “productos.txt”
// - Incluir un llamado de prueba a cada método, y mostrando por pantalla según corresponda para
// verificar el correcto funcionamiento del módulo construído.
// - El formato de cada producto será :
// {
//     title: (nombre del producto),
//     price: (precio),
//     thumbnail: (url de la foto del producto)
//    }

const fs = require('fs')

class Contenedor{
    constructor(url){
        this.url = url
    }
    static counter = 1
    async getAll(){
        const url = this.url
        
            let data
            try{
                let prod = await fs.promises.readFile(url, "utf-8")
                prod = JSON.parse(prod) || null
                return prod
            }
            catch(error){
                console.log("No se pudo encontrar el archivo.")
            }
            
        
        
    }
    save(obj){
        const url = this.url
        
        let id = Contenedor.counter
        this.getAll()
            .then(async (prod)=>{
                try{
                    let data = prod || []
                    while(data.some(el=> el.id == id)){
                        Contenedor.couter += 1
                        id += 1
                        
                    }
                    obj.id = id 
                    data.push(obj)
                    await fs.promises.writeFile(url, JSON.stringify(data) )
                    console.log(`Guardado con el id numero #${id}`)
                    return id
                    
                }
                catch(error){
                    console.log("error al guardar", error)
                }
            })

    }
    getById(id){
        
        this.getAll().then(el=>{
            
            let search = el.find(el=> el.id ==id)
            console.log(search)
            if(search){
                console.log(search)
                
            }else{
                console.log("no se encontró ninguna coincidencia")
            
            }
            return search
        })
        .catch(error =>{
            console.warning(`No fue posible resolver la consulta con el id ${id} .`)
        })
    }
    
    deleteById(id){
        const url = this.url
        this.getAll()
        .then(async el=>{
            let aux = el.filter(el=> el.id !=id)
            await fs.promises.writeFile(url, JSON.stringify(aux) )
                    console.log(`Se borro el elemento con id #${id}`)
        })
        .catch(error=>{
            console.log("No se pudo eliminar el objeto.",error)
        })
    }
    
    async deleteAll(){
        
        const url = this.url
        try{
            await fs.promises.writeFile(url, JSON.stringify([]))
            console.log("Los objetos se han eliminado correctamente")
        }
        catch(error){
            console.log("error al eliminar los elementos", error)
        }
        
            
    }
}


let test = new Contenedor("productos.txt")

test.save({title:"Hola",price:120,thumbnail:""})
// test.getAll().then(res=>{console.log(res)})
test.getById(1)
//  test.deleteById(1)
//  test.deleteAll()
