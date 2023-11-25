class CustomerCatalog {
    static _instance;

    static get_instance(){
        if (!CustomerCatalog._instance){
            CustomerCatalog._instance = new CustomerCatalog();
        }
        return CustomerCatalog._instance;
    }

    constructor() {
        if (CustomerCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._customers = new Map();
    }

    addCustomer(userID){
        let customer = new Customer(userID);
        this._customers.set(userID, customer);
        return customer;
    }

    getCustomer(customerID) {
        if (!this._customers.get(customerID)){
            throw new Error("Invalid Customer! Customer not Found.");
        }
        return this._customers.get(customerID);
    }

    removeCustomer(customerID){
        if (!this._customers.get(customerID)){
            throw new Error("Invalid Customer! Customer not Found.");
        }
        let customer = this._customers.get(customerID);
        this._customers.delete(customerID);
        return customer;
    }

    serialize(){
        const serializedCustomers = Array.from(this._customers.values(), customer => customer.serialize());
        return JSON.stringify({
            customers: serializedCustomers,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedCustomers = data.customers.map(customerData => Customer.deserialize(customerData));

        this._customers = new Map(deserializedCustomers.map(customer => [customer.getID(), customer]));
    }
}

class Customer{
    constructor(id){
        this._id = id;
        this._name = null;
        this._phone = null;
        this._email = null;
        this._address = null;
        this._paymentCatalog = new this.PaymentCatalog(this._id);
    }

    addPayment(type){
        this._paymentCatalog.addPayment(paymentName,type);
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
    getAddress(){
        return this._address;
    }
    getPaymentCatalog(){
        return this._paymentCatalog;
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
    setAddress(address){
        this._address = address;
    }

    serialize() {
        return JSON.stringify({
            id: this._id,
            name: this._name,
            phone: this._phone,
            email: this._email,
            address: this._address.serialize(),
            paymentCatalog: this._paymentCatalog.serialize(),
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const customer = new Customer(data.id);

        if(data.name){customer._name = data.name;}
        if(data.phone){customer._phone = data.phone;}
        if(data.email){customer._email = data.email;}
        customer._address = Address.deserialize(data.address);
        customer._paymentCatalog = PaymentCatalog.deserialize(data.paymentCatalog);

        return customer;
    }
}