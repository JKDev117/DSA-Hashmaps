class HashMap {
    constructor(initialCapacity=8) {
        this.length = 0;
        this._hashTable = []; //will hold all of the data and is considered the hash table
        this._capacity = initialCapacity; //will grow in chunks as you resize to a larger array when the hash table is full
        this._deleted = 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._hashTable[index] === undefined) {
            throw new Error('Key error');
        }
        return this._hashTable[index].value;
    }

    set(key, value){ //initially checks if load ratio is greater than given max
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) { //MAX_LOAD_RATIO to keep track of how full the hashmap is
            this._resize(this._capacity * HashMap.SIZE_RATIO); //SIZE_RATIO used when hashmap is a certain % full
        }
        //Find the slot where this key should be in
        const index = this._findSlot(key);

        if(!this._hashTable[index]){
            this.length++;
        }
        this._hashTable[index] = {
            key,
            value,
            DELETED: false
        }; 
    }

    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }

    _findSlot(key) { //used to find the correct slot for a given key // best & avg case O(1) //worst case O(n)
        const hash = HashMap._hashString(key); //_hashString() used to calculate the hash of the key
        const start = hash % this._capacity;

        for (let i=start; i<start + this._capacity; i++) {
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            }
        }
    }

    _resize(size) { //best & avg. O(n), worst case O(n^2)
        const oldSlots = this._hashTable;
        this._capacity = size;
        // Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._hashTable = [];

        for (const slot of oldSlots) { //O(n)
            if (slot !== undefined) {
                this.set(slot.key, slot.value); //best & avg. O(1), worst O(n)
            }
        }
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            //Bitwise left shift with 5 0s - this would be similar to
            //hash*31, 31 being the decent prime number
            //but bit shifting is a faster way to do this
            //tradeoff is understandability
            hash = (hash << 5) + hash + string.charCodeAt(i);
            //converting hash to a 32 bit integer
            hash = hash & hash;
        }
        //making sure hash is unsigned - meaning non-negtive number. 
        return hash >>> 0;
    }

}




module.exports = HashMap