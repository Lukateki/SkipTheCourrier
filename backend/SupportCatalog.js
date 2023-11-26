class SupportCatalog {

    // singleton pattern
    static _instance;
    
    static getInstance() {
        if (!SupportCatalog._instance) {
            SupportCatalog._instance = new SupportCatalog();
        }
        return SupportCatalog._instance;
    }

    constructor() {
        // to prevent further creation of SupportCatalog instances
        if (SupportCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.");
        }

        this._supports = new Map();
    }

    // Support control method
    addSupport(order, user, issue) {
        let newSupportID = this._supports.size + 1;
        let support = new Support(newSupportID, order, user, issue);
        this._supports.set(newSupportID, support);
        return support;
    }
    getSupport(supportID) {
        return this._supports.get(supportID);
    }

    // method for storing and recovering objects instances
    serialize() {
        const serializedSupports = Array.from(this._supports.values(), support => support.serialize());
        return JSON.stringify({
            supports: serializedSupports,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedSupports = data.supports.map(supportData => Support.deserialize(supportData));

        this._supports = new Map(deserializedSupports.map(support => [support.getSupportID(), support]));
    }
}

const supportStatus = Object.freeze(['Unresolved', 'Resolved']);

class Support extends Subject {
    constructor(supportID, order, user, issue) {
        super();

        // private variables
        this._supportID = supportID;
        this._order = order;
        this._user = user;
        this._issue = issue;
        this._status = supportStatus[0];
        this._agents = [];
        this._observers = [];
        this._chat = new Chat();
    }

    // Observer control methods
    addObserver(observer) {
        this._observers.push(observer);
    }
    removeObserver(observer) {
        const index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._observers.splice(index, 1);
        }
    }
    notifyObservers() {
        for (let i = 1; i <= this._observers.length; i++) {
            this._observers.getObserver(i).update();
        }
    }
    getObserver(index) {
        return this._observers[index];
    }
    addAgent(agent) {
        this._agents.push(agent);
        let agentViewSupport = new agentViewSupport();
        return agentViewSupport;
    }
    getUserSupportView () {
        if (this._observers.length == 0){
            let userSupportView = new UserSupportView();
            return userSupportView;
        }
        return this._observers[1];
    }

    // accessors
    getSupportID() {
        return this._supportID;
    }
    getUser() {
        return this._user;
    }
    getAgents() {
        return this._agents;
    }
    getOrder() {
        return this._order;
    }
    getChat() {
        return this._chat;
    }
    getObservers() {
        return this._observers;
    }
    getStatus() {
        return this._status;
    }
    setStatus(status) {
        this._status = status;
    }
    

    // Chat control method
    sendMessage(userID, userType, userName, message) {
        this._chat.addMessage(userID, userType, userName, message);
    }

    // methods for storing and recovering objects instances
    serialize() {
        return JSON.stringify({
            supportID: this._supportID,
            order: this._order,
            user: this._user,
            issue: this._issue,
            status: this._status,
            agents: this._agents,
            observers: this._observers,
            chat: this._chat.serialize(),
        });
    }
    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const support = new Support(data.supportID, data.order, data.user, data.issue);

        support._status = data.status;
        support._agents = data.agents;
        support._observers = data.observers;
        support._chat = Chat.deserialize(data.chat);

        return support;
    }
}

class Chat {
    constructor() {
        // private variables
        this._messages = [];
    }

    // Chat control methods
    addMessage(uID, uName, uType, message) {
        let m = new Message(uID, uName, uType, message);
        this._messages.push(m);
    }
    getMessages() {
        return this._messages;
    }

    // methods for storing and recovering objects instances
    serialize() {
        const serializedMessages = this._messages.map(message => message.serialize());
        return JSON.stringify({
            messages: serializedMessages,
        });
    }
    deserialize(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const deserializedMessages = data.messages.map(messageData => Message.deserialize(messageData));
            this._messages = deserializedMessages;
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
}

class Message {

    constructor(userID, userName, userType, message) {

        //private variables
        this._userID = userID;
        this._userType = userType;
        this._userName = userName;
        this._message = message;
        this._date = new Date();
    }

    // accessors
    getUserID() {
        return this._userID;
    }
    getUserType() {
        return this._userType;
    }
    getUserName() {
        return this._userName;
    }
    getMessage() {
        return this._message;
    }
    getDate() {
        return this._date;
    }

    // methods for storing and recovering objects instances
    serialize() {
        return JSON.stringify({
            userID: this._userID,
            userType: this._userType,
            userName: this._userName,
            message: this._message,
            date: this._date.toJSON(),
        });
    }
    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const _instance = new Message(data.userID, data.userName, data.userType, data.message);

        _instance._date = new Date(data.date);

        return _instance;
    }
}
