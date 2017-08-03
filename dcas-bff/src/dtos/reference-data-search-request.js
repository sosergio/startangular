import AuthRequest from './auth-request';
export default class ReferenceDataSearchRequest{
    constructor(template){
        
        this.freeText=null;
        this.status=null;
        this.order=null;
        this.asc=false;
        this.count=20;
        this.offset=0;
        this.allVersions=false;
        this.auth = new AuthRequest();

        if(template){
            Object.assign(this, template);
        }
    }
}