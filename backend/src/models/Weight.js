class Weight{
    constructor(weightKg){
        this._weight = weightKg;
    }
    getWeightKg(){
        return this._weight;
    }
    getWeightLbs(){
        return (this._weight * 2.20462);
    }
}

export default Weight;