import User from "./src/models/User";
import UserType from "./src/enums/UserType";

class UserCatalog {

    static _instance;
    static _userCount;

    static getInstance(){
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
    authenticateUser(name, password) {
        if(!this._users.get(name)){
            throw new Error("Invalid User! User not found.");
        }
        if(!this._users.get(name).validate(password)){
            throw new Error("Invalid Password!");
        }
        return this._users.get(name);
    }
    getUser(name){
        if (this._users.get(name)){
            throw new Error("User not fount.");
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
            userCount: this._userCount,
            users: serializedUsers,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedUsers = data.users.map(userData => User.deserialize(userData));

        this._users = new Map(deserializedUsers.map(user => [user.getID(), user]));
        this._userCount = data.userCount;
    }
}

export default UserCatalog;
