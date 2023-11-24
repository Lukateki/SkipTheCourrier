class AgentCatalog {
    static _instance;

    static get_instance(){
        if (!AgentCatalog._instance){
            AgentCatalog._instance = new AgentCatalog();
        }
        return AgentCatalog._instance;
    }

    constructor() {
        if (AgentCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._agents = new Map();
    }

    addAgent(userID){
        let agent = new Agent(userID);
        this._agents.set(userID, agent);
        return agent;
    }

    getAgent(agentID) {
        if (!this._agents.get(agentID)){
            throw new Error("Invalid Agent! Agent not Found.");
        }
        return this._agents.get(agentID);
    }

    removeAgent(agentID){
        if (!this._agents.get(agentID)){
            throw new Error("Invalid Agent! Agent not Found.");
        }
        let agent = this._agents.get(agentID);
        this._agents.delete(agentID);
        return agent;
    }

    serialize(){
        const serializedUsers = Array.from(this._agents.values(), agent => agent.serialize());
        return JSON.stringify({
            agents: serializedUsers,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedAgents = data.agents.map(agentData => Agent.deserialize(agentData));

        this._agents = new Map(deserializedAgents.map(agent => [agent.getUserID(), agent]));
    }
}

class Agent{
    constructor(id){
        this._id = id;
        this._name = null;
        this._phone = null;
        this._email = null;
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
    setName(name){
        this._name = name;
    }
    setPhone(phone){
        this._phone = phone;
    }
    setEmail(email){
        this._email = email;
    }

    serialize() {
        return JSON.stringify({
            id: this._id,
            name: this._name,
            phone: this._phone,
            email: this._email,
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const agent = new Agent(data.id);

        if(data.name){agent._name = data.name;}
        if(data.phone){agent._phone = data.phone;}
        if(data.email){agent._email = data.email;}
        return agent;
    }
}