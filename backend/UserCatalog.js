class UserCatalog {

    static _instance;
    static _userCount;

    static get_instance(){
        if (!UserCatalog._instance){
            UserCatalog._instance = new UserCatalog();
        }
        return UserCatalog._instance;
    }

    constructor() {
        if (UserCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._userCount = 0;
        this._users = new Map();
    }

    addUser(type, name, password) {
        if (!UserType.includes(type)){
            throw new Error("Invalid User Type. Options : Customer, Agent, Carrier");
        }
        if (this._users.get(name)){
            throw new Error("This User name is already in use.");
        }
        if (!password) {
            throw new Error("Password cannot be empty.");
        }
        let newUserID = this._userCount++;
        let user = new User(newUserID, type, name, password);
        this._users.set(name, user);
        return user;
    }
    getUser(name, password) {
        if(!this._users.get(name)){
            throw new Error("Invalid User! User not found.");
        }
        if(!this._users.get(name).validate(password)){
            throw new Error("Invalid Password!");
        }
        return this._users.get(name);
    }
    removeUser(name, password) {
        if(!this._users.get(name)){
            throw new Error("Invalid User! User not found.");
        }
        if(!this._users.get(name).validate(password)){
            throw new Error("Invalid Password!");
        }
        let user = this._users.get(name);
        this._users.delete(name);
        return user;
    }

    serialize(){
        const serializedUsers = Array.from(this._users.values(), user => user.serialize());
        return JSON.stringify({
            users: serializedUsers,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializesUsers = data.users.map(userData => User.deserialize(userData));

        this._users = new Map(deserializedUsers.map(user => [user.getID(), user]));
    }
}

class User {
    constructor(id, type, name, password) {
        this._id = id;
        this._type = type;
        this._name = name;
        this._password = password;
    }
    validate(password){
        if (this.password === password){
            return true;
        }
        return false;
    }
    getID(){
        return this._id;
    }
    getType(){
        return this._type;
    }
    changeUserPassword(oldPassword, newPassword){
        if(!this.validate(oldPassword)){
            throw new Error("Old Password is Invalid!")
        }
        this._password = newPassword;
    }
    serialize() {
        return JSON.stringify({
            id: this._id,
            type: this._type,
            name: this._name,
            password: this._password,
        })
    }
    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const user = new User(data.id, data.type, data.name, data.password);

        return user;
    }
}

// js version of an enum
const UserType = Object.freeze(['Customer', 'Agent', 'Carrier']);