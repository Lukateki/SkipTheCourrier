import PackageCatalog from './src/catalogs/PackageCatalog';
import UserCatalog from './src/catalogs/UserCatalog';
import AgentCatalog from './src/catalogs/AgentCatalog';
import CarrierCatalog from './src/catalogs/CarrierCatalog';
import CustomerCatalog from './src/catalogs/CustomerCatalog';
import QuotationCatalog from './src/catalogs/QuotationCatalog';
import OrderCatalog from './src/catalogs/OrderCatalog';
import TransactionCatalog from './src/catalogs/TransactionCatalog';
import SupportCatalog from './src/catalogs/SupportCatalog';
import ReviewCatalog from './src/catalogs/ReviewCatalog';
import Size from './src/models/Size'
import Weight from './src/models/Weight'


class SkipTheCourrier{
    static _instance;

    static getInstance(){
        if (!SkipTheCourrier._instance){
            SkipTheCourrier._instance = new SkipTheCourrier();
        }
        return SkipTheCourrier._instance;
    }

    constructor(){
        this._userCatalog = UserCatalog.getInstance();
        this._agentCatalog = AgentCatalog.getInstance();
        this._carrierCatalog = CarrierCatalog.getInstance();
        this._customerCatalog = CustomerCatalog.getInstance();
        this._packageCatalog = PackageCatalog.getInstance();
        this._quotationCatalog = QuotationCatalog.getInstance();
        this._orderCatalog = OrderCatalog.getInstance();
        this._transactionCatalog = TransactionCatalog.getInstance();
        this._supportCatalog = SupportCatalog.getInstance();
        this._reviewCatalog = ReviewCatalog.getInstance();
        let parseAddress = function (address){
            //logic to parse address and return Address object
        }
        let createSize = function (lengthCm, widthCm, heightCm){
            return new Size(lengthCm, widthCm, heightCm);
        }
        let createWeight = function (weightKg){
            return new Weight(weightKg)
        }
        let createPackage = function (size, weight){
            return this._packageCatalog.addPackage(size, weight);
        }
        let createQuotation = function (src, dst, package){
            return this._quotationCatalog.addQuotation(src, dst, package);
        }
        let createOrder = function (customerID, quotationID){
            return this._orderCatalog.addOrder(customerID, quotationID);
        }
        let fetchCustomerPayment = function (customerID, paymentName){
            let customer = this._customerCatalog.getCustomer(customerID);
            let paymentCatlaog = customer.getPaymentCatalog();
            return paymentCatlaog.getPayment(paymentName);
        }
        let createTransaction = function (customerID, quotationID){
            return this._transactionCatalog.addTransaction(customerID, quotationID);
        }
        let createSupport = function (userID, orderID, issue){
            return this._supportCatalog.addSupport(userID, orderID, issue);
        }
        let createUserSupportView = function (user, support){
            return new UserSupportView(user, support);
        }
        let createReview = function (comment, rating){
            return this._reviewCatalog.addRevier(rating, comment);
        }
    }

    static requestQuotationProposal(lengthCm, widthCm, heightCm, weightKg, source, destination){
        let src = this.parseAddress(source);
        let dst = this.parseAddress(destination);
        let size = this.createSize(lengthCm, widthCm, heightCm);
        let weight = this.createWeight(weightKg);
        let package = this.createPackage(size, weight);
        return this.createQuotation(src, dst, package);
    }

    static requestDelivery(customerID, quotationID){
        return this.createOrder(customerID, quotationID)
    }

    static makePayment(orderID, paymentName, billingAddress){
        let billingAddr = this.parseAddress(billingAddress);
        let order = this._orderCatalog.getOrder(orderID);
        let customerID = order.getCustomerID();
        let quotationID = order.getQuotationID();
        let quotation = this._quotationCatalog.getQuotation(quotationID);
        let payment = fetchCustomerPayment(customerID, paymentName);
        let transaction = createTransaction(customerID, quotationID);
        transaction.setPayment(payment);
        transaction.setBillingAddress(billingAddr);
        let total = quotation.getTotal();
        transaction.makePayment(total); // maybe return something
    }

    static trackOrder(orderID){
        let order = this._orderCatalog.getOrder(orderID);
        return order.getStatus();
    }

    static requestSupport(userID, orderID, issue){
        let user = this._userCatalog.getUser(userID);
        let support = createSupport(userID, orderID, issue);
        let order = this._orderCatalog.getOrder(orderID);
        if (order.getCustomerID() !== userID && order.getCarrierID() !== userID){
            throw new Error("User not allowed to request support for this order.");
        }
        return this.createUserSupportView(user, support);
    }

    static reviewService(comment, rating){
        return this.createReview(comment, rating);
    }

}

export default SkipTheCourrier;