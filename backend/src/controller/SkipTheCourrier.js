import PackageCatalog from './src/catalogs/PackageCatalog';
import UserCatalog from './src/catalogs/UserCatalog';
import AgentCatalog from './src/catalogs/AgentCatalog';
import CarrierCatalog from './src/catalogs/CarrierCatalog';
import CustomerCatalog from './src/catalogs/CustomerCatalog';
import QuotationCatalog from './src/catalogs/QuotationCatalog';
import OrderCatalog from './src/catalogs/OrderCatalog';
import TransactionCatalog from './src/catalogs/TransactionCatalog';
import SupportCatalog from './src/catalogs/SupportCatalog';
import ReviewCatalog from './src/catalogs/ReviewCatalog';


class SkipTheCourrier{
    static _instance;

    static getInstance(){
        if (!SkipTheCourrier._instance){
            SkipTheCourrier._instance = new SkipTheCourrier();
        }
        return SkipTheCourrier._instance;
    }

    constructor(){
        this._userCatalog = UserCatalog.getInstance();
        this._agentCatalog = AgentCatalog.getInstance();
        this._carrierCatalog = CarrierCatalog.getInstance();
        this._customerCatalog = CustomerCatalog.getInstance();
        this._packageCatalog = PackageCatalog.getInstance();
        this._quotationCatalog = QuotationCatalog.getInstance();
        this._orderCatalog = OrderCatalog.getInstance();
        this._transactionCatalog = TransactionCatalog.getInstance();
        this._supportCatalog = SupportCatalog.getInstance();
        this._reviewCatalog = ReviewCatalog.getInstance();
    }
}

export default SkipTheCourrier;