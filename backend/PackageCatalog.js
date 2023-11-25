class PackageCatalog {
    static _instance;
    static _packageCount;

    static get_instance(){
        if (!PackageCatalog._instance){
            PackageCatalog._instance = new PackageCatalog();
        }
        return PackageCatalog._instance;
    }

    constructor() {
        if (PackageCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._packages = new Map();
        this._packageCount = 0;
    }

    addPackage(size, weight){
        let newPackageID = this._packageCount++;
        let package = new Package(newPackageID, size, weight);
        this._packages.set(newPackageID, package);
        return package;
    }

    getPackage(packageID) {
        if (!this._packages.get(packageID)){
            throw new Error("Invalid Package! Package not Found.");
        }
        return this._packages.get(packageID);
    }

    removePackage(packageID){
        if (!this._packages.get(packageID)){
            throw new Error("Invalid Package! Package not Found.");
        }
        let package = this._packages.get(packageID);
        this._packages.delete(packageID);
        return package;
    }

    serialize(){
        const serializedPackages = Array.from(this._packages.values(), package => package.serialize());
        return JSON.stringify({
            packageCount: this._packageCount,
            packages: serializedPackages,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedPackages = data.packages.map(packageData => Package.deserialize(packageData));

        this._packages = new Map(deserializedPackages.map(package => [package.getID(), package]));
        this._packageCount = data.packageCount;
    }
}

class Package{
    constructor(id, size, weight){
        this._id = id;
        this._size = size;
        this._weight = weight;
    }
    getID(){
        return this.id;
    }
    getSize(){
        return this._size;
    }
    getWeight(){
        return this._weight;
    }
    setSize(size){
        this._size = size;
    }
    setWeight(weight){
        this._weight = weight;
    }

    serialize() {
        return JSON.stringify({
            id: this._id,
            size: this._size.serialize(),
            weight: this._weight.serialize(),
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const size = Size.deserialize(data.size);
        const weight = Size.deserialize(data.weight);
        const package = new Package(data.id, size, weight);

        return package;
    }
}

class Size{
    constructor(lengthCm, widthCm, heightCm){
        this._length = lengthCm;
        this._width = widthCm;
        this.height = heightCm;
    }
    getLengthCm(){
        return this._length;
    }
    getWidthCm(){
        return this._width;
    }
    getHeightCm(){
        return this._height;
    }
    getLengthInch(){
        return (this._length * 0.393701);
    }
    getWidthInch(){
        return (this._width * 0.393701);
    }
    getHeightInch(){
        return (this._height * 0.393701);
    }
}

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