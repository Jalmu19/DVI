export class Movements {
    /**
     * @param {boolean} up
     * @param {boolean} down 
     * @param {boolean} left 
     * @param {boolean} right
     * @param {boolean} interact
     */

    constructor() {
        this.reset();
    }

    getIsUpDown() {
        return this.up;
    }

    setIsUpDown(val) {
        this.up = val;
    }

    getIsDownDown() {
        return this.down;
    }

    setIsDownDown(val) {
        this.down = val;
    }

    getIsLeftDown() {
        return this.left;
    }

    setIsLeftDown(val) {
        this.left = val;
    }

    getIsRightDown() {
        return this.right;
    }

    setIsRightDown(val) {
        this.right = val;
    }

    getIsInteractDown() {
        return this.interact;
    }

    setIsInteractDown(val) {
        this.interact = val;
    }

    reset() {
        this.up = false;
        this.down = false
        this.left = false;
        this.right = false;
        this.interact = false;
    }
}