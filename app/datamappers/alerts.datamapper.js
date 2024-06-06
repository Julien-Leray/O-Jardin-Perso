import CoreDatamapper from "./coreDatamapper.js";

class AlertsDatamapper extends CoreDatamapper {
  constructor() {
    super('"user"');
  }
}

export default new AlertsDatamapper();