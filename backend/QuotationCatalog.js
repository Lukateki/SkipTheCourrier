class QuotationCatalog{
    static _instance;
    static _quotationCount;

    static get_instance(){
        if (!QuotationCatalog._instance){
            QuotationCatalog._instance = new QuotationCatalog();
        }
        return QuotationCatalog._instance;
    }

    constructor() {
        if (QuotationCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._quotations = new Map();
        this._quotationCount = 0;
    }

    addQuotation(src, dst){
        let newQuotationID = this._quotationCount++;
        let quotation = new Quotation(newQuotationID, src, dst);
        this._quotations.set(newQuotationID, quotation);
        return quotation;
    }

    getQuotation(quotationID) {
        if (!this._quotations.get(quotationID)){
            throw new Error("Invalid Quotation! Quotation not Found.");
        }
        return this._quotations.get(quotationID);
    }

    removeQuotation(quotationID){
        if (!this._quotations.get(quotationID)){
            throw new Error("Invalid Quotation! Quotation not Found.");
        }
        let quotation = this._quotations.get(quotationID);
        this._quotations.delete(quotationID);
        return quotation;
    }

    serialize(){
        const serializedQuotations = Array.from(this._quotations.values(), quotation => quotation.serialize());
        return JSON.stringify({
            quotationCount: this._quotationCount,
            quotations: serializedQuotations,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedQuotations = data.quotations.map(quotationData => Quotation.deserialize(quotationData));

        this._quotations = new Map(deserializedQuotations.map(quotation => [quotation.getID(), quotation]));
        this._quotationCount = data.quotationCount;
    }
}


class Quotation{
    constructor(id, src, dst){
        this._id = id;
        this._src = src;
        this._dst = dst;
        this._packages = [];
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