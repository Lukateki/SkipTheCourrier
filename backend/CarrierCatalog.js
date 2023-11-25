class CarrierCatalog {
    static _instance;

    static get_instance(){
        if (!CarrierCatalog._instance){
            CarrierCatalog._instance = new CarrierCatalog();
        }
        return CarrierCatalog._instance;
    }

    constructor() {
        if (CarrierCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._carriers = new Map();
    }

    addCarrier(userID){
        let carrier = new Carrier(userID);
        this._carriers.set(userID, carrier);
        return carrier;
    }

    getCarrier(carrierID) {
        if (!this._carriers.get(carrierID)){
            throw new Error("Invalid Carrier! Carrier not Found.");
        }
        return this._carriers.get(carrierID);
    }

    removeCarrier(carrierID){
        if (!this._carriers.get(carrierID)){
            throw new Error("Invalid Carrier! Carrier not Found.");
        }
        let carrier = this._carriers.get(carrierID);
        this._carriers.delete(carrierID);
        return carrier;
    }

    serialize(){
        const serializedCarriers = Array.from(this._carriers.values(), carrier => carrier.serialize());
        return JSON.stringify({
            carriers: serializedCarriers,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedCarriers = data.carriers.map(carrierData => Carrier.deserialize(carrierData));

        this._carriers = new Map(deserializedCarriers.map(carrier => [carrier.getID(), carrier]));
    }
}

class Carrier{
    constructor(id){
        this._id = id;
        this._name = null;
        this._phone = null;
        this._email = null;
    }
    getID(){
        return this.id;
    }
    getName(){
        return this._name;
    }
    getPhone(){
        return this._phone;
    }
    getEmail(){
        return this._email;
    }
    setName(name){
        this._name = name;
    }
    setPhone(phone){
        this._phone = phone;
    }
    setEmail(email){
        this._email = email;
    }

    serialize() {
        return JSON.stringify({
            id: this._id,
            name: this._name,
            phone: this._phone,
            email: this._email,
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const carrier = new Carrier(data.id);

        if(data.name){carrier._name = data.name;}
        if(data.phone){carrier._phone = data.phone;}
        if(data.email){carrier._email = data.email;}

        return carrier;
    }
}