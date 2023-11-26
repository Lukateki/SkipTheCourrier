class OrderCatalog{
    static _instance;
    static _orderCount;

    static get_instance(){
        if (!OrderCatalog._instance){
            OrderCatalog._instance = new OrderCatalog();
        }
        return OrderCatalog._instance;
    }

    constructor() {
        if (OrderCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._orders = new Map();
        this._orderCount = 0;
    }

    addOrder(customerID, quotationID){
        let newOrderID = this._orderCount++;
        let order = new Order(newOrderID, customerID, quotationID);
        this._orders.set(newOrderID, order);
        return order;
    }

    getOrder(orderID) {
        if (!this._orders.get(orderID)){
            throw new Error("Invalid Order! Order not Found.");
        }
        return this._orders.get(orderID);
    }

    removeOrder(orderID){
        if (!this._orders.get(orderID)){
            throw new Error("Invalid Order! Order not Found.");
        }
        let order = this._orders.get(orderID);
        this._orders.delete(orderID);
        return order;
    }

    serialize(){
        const serializedOrders = Array.from(this._orders.values(), order => order.serialize());
        return JSON.stringify({
            orderCount: this._orderCount,
            orders: serializedOrders,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedOrders = data.orders.map(orderData => Order.deserialize(orderData));

        this._orders = new Map(deserializedOrders.map(order => [order.getID(), order]));
        this._orderCount = data.orderCount;
    }
}

const OrderStatus = Object.freeze(['waiting for payment', 'processing payment', 'processing order', 'shipped', 'out for delivery', 'delivered']);

class Order{
    constructor(id, customerID, quotationID){
        this._id = id;
        this._customerID = customerID;
        this._quotationID = quotationID;
        this._carrierID = null;
        this._transactionID = null;
        this._status = OrderStatus[1];
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
    getCarrierID(){
        return this._carrierID;
    }
    getTransactionID(){
        return this._transactionID;
    }
    getStatus(){
        return this._status;
    }
    setCarrierID(carrierID){
        this._carrierID = carrierID;
    }
    setTransactionID(transactionID){
        this._transactionID = transactionID;
    }
    setStatus(status){
        this._status = status;
    }
    

    serialize() {
        return JSON.stringify({
            id: this._id,
            customerID: this._customerID,
            quotationID: this._quotationID,
            carrierID: this._carrierID,
            transactionID: this._transactionID,
            status: this._status,
        });
    }

    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const order = new Order(data.id, data.customerID, data.quotationID);
        if(data.carrierID){order.setCarrierID(data.carrierID);}
        if(data.transactionID){order.setTransactionID(data.transactionID);}
        order.setStatus(data.status);

        return order;
    }
}