class PaymentCatalog{
    constructor(id){
        this._id = id;
        this._payments = new Map();
    }
    addPayment(paymentName, paymentType){
        newPayment = PaymentFactory.createPayment(paymentType, data); // object literal for data
        this._payments.set(paymentName, newPayment);
    }
    getPayment(paymentName){
        if(!this._payments.get(paymentName)){
            throw new Error("No such payment found.")
        }
        return this._payments.get(paymentName);
    }
    removePayment(paymentName){
        if(!this._payments.get(paymentName)){
            throw new Error("No such payment found.")
        }
        let payment = this._payments.get(paymentName);
        this._payments.delete(paymentName);
        return payment;
    }

    serialize(){
        const serializedPayments = Array.from(this._payments.values(), payment => payment.serialize());
        return JSON.stringify({
            payments: serializedPayments,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedPayments = data.payments.map(paymentData => Payment.deserialize(paymentData));

        this._payments = new Map(deserializedPayments.map(payment => [payment.getName(), payment]));
    }
}

class PaymentFactory {
    static _instance;

    static get_instance(){
        if (!CustomerCatalog._instance){
            CustomerCatalog._instance = new CustomerCatalog();
        }
        return CustomerCatalog._instance;
    }

    constructor() {
        if (PaymentCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
    }

    static createPayment(type, data){
        if (!PaymentType.includes(type)){
            throw new Error("Invalid User Type. Options : paypal, credit");
        }
        switch(type){
            case PaymentType[0]:
                return new PaypalPayment(data);
                break;
            case PaymentType[1]:
                return new CreditPayment(data);
                break;
        }
    }
}

const PaymentType = Object.freeze(['paypal', 'credit']);

class Payment {
    makePayment (amount) {
        throw new Error("makePayment() not defined.");
    }
}

class PaypalPayment extends Payment{
    constructor({name, email}){
        super();
        this._name = name;
        this._email = email;
    }
    makePayment (amount) {
        // TODO : makePayment logic
    }
    getName(){
        return this._name;
    }

    serialize(){
        return JSON.stringify({
            name: this._name,
            email: this._email,
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        let name = data.name;
        let email = data.email;
        const paypalPayment = new PaypalPayment({name, email});

        return paypalPayment;
    }
}

class CreditPayment extends Payment{
    constructor({name, nameOnCard, cardNumber, expirationDate, cvv}) {
        super();
        this._name = name;
        this._nameOnCard = nameOnCard;
        this._cardNumber = cardNumber;
        this._expirationDate = expirationDate;
        this._cvv = cvv;
    }
    makePayment (amount) {
        // TODO : makePayment logic
    }
    getName(){
        return this._name;
    }

    serialize(){
        return JSON.stringify({
            name: this._name,
            nameOnCard : this._nameOnCard,
            cardNumber : this._cardNumber,
            expirationDate : this._expirationDate,
            cvv : this._cvv,
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        let name = data.name;
        let nameOnCard = data.nameOnCard;
        let cardNumber = data.cardNumber;
        let expirationDate = data.expirationDate;
        let cvv = data.cvv;
        const paypalPayment = new PaypalPayment({name, nameOnCard, cardNumber, expirationDate, cvv});

        return paypalPayment;
    }
}