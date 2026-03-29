class Inventory{
    constructor(){
        this.items = []
    }

    addItem(id, name, frame, quantity, texture){
        console.log(id)
        console.log(name)
        console.log(frame)
        console.log(quantity)
        const i = this.items.find(item => item.id === id)

        if(i) {i.quantity += quantity}
        else {this.items.push({id, name, frame, quantity, texture})}

        return true
    }

    eliminateItem(id){
        const index = this.items.findIndex(item => item.id === id)
        
        if (index !== -1) {
            this.items[index].quantity--

            if (this.items[index].quantity <= 0) this.items.splice(index, 1)
        }
    }

    getItems() { return this.items }
    
}


const instance = new Inventory();

export default instance;