import TransactionStatus from './src/enums/TransactionStatus'
import CreditPayment from './src/models/CreditPayment'
import PaypalPayment from './src/models/PaypalPayment'
import Address from './src/models/Address'
import Payment from './src/models/Payment'

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
            billingAddress: this._billingAddress.serialize(),
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
        if(data.billingAddress){transaction.setBillingAddress(Address.deserialize(data.billingAddress));}
        transaction.setStatus(data.status);

        return transaction;
    }
}

export default Transaction;