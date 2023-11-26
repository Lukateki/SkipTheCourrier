class TransactionCatalog{
    static _instance;
    static _transactionCount;

    static get_instance(){
        if (!TransactionCatalog._instance){
            TransactionCatalog._instance = new TransactionCatalog();
        }
        return TransactionCatalog._instance;
    }

    constructor() {
        if (TransactionCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._transactions = new Map();
        this._transactionCount = 0;
    }

    addTransaction(customerID, quotationID){
        let newTransactionID = this._transactionCount++;
        let transaction = new Transaction(newTransactionID, customerID, quotationID);
        this._transactions.set(newTransactionID, transaction);
        return transaction;
    }

    getTransaction(transactionID) {
        if (!this._transactions.get(transactionID)){
            throw new Error("Invalid Transaction! Transaction not Found.");
        }
        return this._transactions.get(transactionID);
    }

    removeTransaction(transactionID){
        if (!this._transactions.get(transactionID)){
            throw new Error("Invalid Transaction! Transaction not Found.");
        }
        let transaction = this._transactions.get(transactionID);
        this._transactions.delete(transactionID);
        return transaction;
    }

    serialize(){
        const serializedTransactions = Array.from(this._transactions.values(), transaction => transaction.serialize());
        return JSON.stringify({
            transactionCount: this._transactionCount,
            transactions: serializedTransactions,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedTransactions = data.transactions.map(transactionData => Transaction.deserialize(transactionData));

        this._transactions = new Map(deserializedTransactions.map(transaction => [transaction.getID(), transaction]));
        this._transactionCount = data.transactionCount;
    }
}

const TransactionStatus = Object.freeze(['pending', 'completed', 'declined']);

class Transaction{
    constructor(id, customerID, quotationID){
        this._id = id;
        this._customerID = customerID;
        this._quotationID = quotationID;
        this._payment = null;
        this._paymentType = null;
        this._billingAddress = null;
        this._status = TransactionStatus[1];
    }
    getID(){
        return this.id;
    }
    getCustomerID(){
        return this._customerID;
    }
    getQuotationID(){
        return this._quotationID;
    }
    getPayment(){
        return this._payment;
    }
    getPaymentType(){
        return this._paymentType;
    }
    getBillingAddress(){
        return this._billingAddress;
    }
    getStatus(){
        return this._status;
    }
    setPayment(payment, paymentType){
        this._payment = payment;
        this._paymentType = paymentType;
    }
    setBillingAddress(billingAddress){
        this._billingAddress = billingAddress;
    }
    setStatus(status){
        this._status = status;
    }

    makePayment(total){
        response = this._payment.makePayment(total);
    }
    

    serialize() {
        return JSON.stringify({
            id: this._id,
            customerID: this._customerID,
            quotationID: this._quotationID,
            payment: this._payment.serialize(),
            paymentType: this._paymentType,
            billingAddress: this._billingAddress,
            status: this._status,
        });
    }

    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const transaction = new Transaction(data.id, data.customerID, data.quotationID);
        if(data.payment){
            switch(data.paymentType){
                case PaymentType[0]:
                    transaction.setPayment(PaypalPayment.deserialize(data.payment),data.paymentType);
                    break;
                case PaymentType[1]:
                    transaction.setPayment(CreditPayment.deserialize(data.payment),data.paymentType);
                    break;
            }
        }
        if(data.billingAddress){transaction.setBillingAddress(data.billingAddress);}
        transaction.setStatus(data.status);

        return transaction;
    }
}