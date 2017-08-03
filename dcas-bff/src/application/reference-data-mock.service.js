import Wreck from 'wreck';
import LoggerFactory from './../common/services/logger.service';
import fs from 'fs';

export default class ReferenceDataAppServiceMock {

    constructor(environment) {
        this.environment = environment;
        this.logger = LoggerFactory(environment);
        this.data = [];
    }

    search(type, request) {
        var self = this;
        return new Promise((resolve, reject) => {
            this.getOrCreateCollection(type).then(all => {
                console.log("[ReferenceDataAppService] search - Retrieved with success");
                let result = all;
                if (request.freeText) {
                    result = all.filter(d => {
                        for (let p in d) {
                            if (d[p].toString().toLowerCase().indexOf(request.freeText.toLowerCase()) > -1) {
                                return true;
                            }
                        }
                    });
                }

                if (!request.allVersions) {
                    let objTypeCameCase = type.toCamelCase() + "Id";
                    let grouped = result.groupBy(objTypeCameCase);
                    let highestCeds = Object.keys(grouped).map(key => {
                        let arr = grouped[key];
                        let highestCed = arr.orderBy("changeEffectiveDate", false)[0];
                        return highestCed;
                    });
                    result = highestCeds;

                } else if (request.status) {
                    result = result.filter(d => d.approvalStatusId == request.status);
                }

                if (request.order) {
                    result = result.orderBy(request.order, request.asc);
                }

                let page = result ? result.slice(request.offset, request.count + request.offset) : null;

                let response = {
                    data: page,
                    currentPage: parseInt((request.offset / request.count) + 1),
                    totalCount: result.length
                };
                return resolve(response);
            });

        });
    }

    getOrCreateCollection(type) {
        let server = this.environment.server;
        var fileUrl = `./assets/data/mock-${type}.json`;
        let self = this;
        return new Promise((resolve, reject) => {
            let collection = self.data[type];
            if (!collection) {
                if (type != "business" && type != "product") {
                    collection = [];
                    for (let n = 1; n <= 100; n++) {
                        let obj = {
                            id: n,
                            objectType: type,
                            name: `${type} ${n}`,
                            changeEffectiveDate: '2017-01-01T00:00:00Z',
                            approvalStatusId: 3
                        };
                        obj[type + "Id"] = n;
                        collection.push(obj);
                    }
                    self.data[type] = collection;
                    resolve(collection);
                } else {
                    fs.readFile(fileUrl, 'utf8', function (err, data) {
                        if (err) reject(err);
                        else {
                            let collection = JSON.parse(data);
                            self.data[type] = collection;
                            resolve(collection);
                        }
                    });
                }
            }else{
                resolve(collection);
            }
        });
    }



    load(type, id) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.getOrCreateCollection(type).then(collection => {
                if (collection) {
                    resolve(collection.find(x => x.id == id));
                } else reject(404);
            });
        });
    }

    create(type, item) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.getOrCreateCollection(type).then(collection => {
                if (collection) {
                    item.id = collection.length+1;
                    collection.push(item);
                    resolve(item);
                } else reject(404);
            });
        });
    }

    update(type, id, item) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.getOrCreateCollection(type).then(collection => {
                if (collection) {
                    let found = collection.find(x => x.id == id);
                    Object.assign(found,item);
                    resolve(found);
                } else reject(404);
            });
        });
    }

    delete(type, id, reason) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.getOrCreateCollection(type).then(collection => {
                if (collection) {
                    let ix = collection.indexOfItemWithAttr('id',+id);
                    if(ix != -1){
                        collection.splice(ix,1);
                        return resolve(true);
                    }
                    return reject(404);
                   
                } else return reject(404);
            });
        });
    }

    submitMany(type, ids) {}

    approveMany(type, ids) {}

    rejectMany(type, ids) {}

    retractMany(type, ids) {}

    withdrawMany(type, ids) {}
}