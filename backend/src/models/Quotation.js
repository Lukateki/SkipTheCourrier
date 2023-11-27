import Address from './src/models/Address'
import Package from './src/models/Package'

class Quotation{
    constructor(id, src, dst, package){
        this._id = id;
        this._src = src;
        this._dst = dst;
        this._packages = [];
        this._packages.push(package);
    }
    getID(){
        return this.id;
    }
    getSource(){
        return this._src;
    }
    getDestination(){
        return this._dst;
    }
    getPackages(){
        return this._packages;
    }
    addPackage(package){
        this._packages.push(package);
    }
    removePackage(packageID){
        this._packages = this._packages.filter(pkg => pkg.getID() !== packageID);
    }
    getTotal(){
        // TODO: logic for calculating total. 
        // Maybe something like finding the addresses longitude, latittude, then get the distance and multiply by kg and cm^3 and some arbitrary unit price/km*kg*cm^3
    }
    

    serialize() {
        const serializedPackages = this._packages.map(pkg => pkg.serialize());
        return JSON.stringify({
            id: this._id,
            src: this._src.serialize(),
            dst: this._dst.serialize(),
            packages: serializedPackages
        });
    }

    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const src = Address.deserialize(data.src);
        const dst = Address.deserialize(data.dst);
        const quotation = new Quotation(data.id, src, dst);

        data.packages.forEach(pkgData => {
            const pkg = Package.deserialize(pkgData);
            quotation.addPackage(pkg);
        });

        return quotation;
    }
    
}

export default Quotation;