import UserType from "./src/enums/UserType";

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

export default User;