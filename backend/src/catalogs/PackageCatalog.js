import Package from './src/models/Package';

class PackageCatalog {
    static _instance;
    static _packageCount;

    static getInstance(){
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

export default PackageCatalog;