import CoreDatamapper from "./coreDatamapper.js";

class ProfileDatamapper extends CoreDatamapper {
  constructor() {
    super('"user"');
  }


}

export default new ProfileDatamapper();
