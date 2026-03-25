export default class Inventory{
    constructor(){
        this.items = []
    }

    addItem(id, name, frame, quantity){
        const i = this.items.find(item => item.id === id)

        if(i) {i.quantity += quantity}
        else {this.items.push({id, name, frame, quantity})}

        return true
    }

    eliminateItem(id){
        const index = this.items.findIndex(item => item.id === id)
        
        if (index !== -1) {
            this.items[index].cantidad--

            if (this.items[index].cantidad <= 0) this.items.splice(index, 1)
        }
    }
    
}