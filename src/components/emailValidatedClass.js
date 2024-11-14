export class emailValidated {
    constructor(id, email, hashedCode, isValidated) {
        this.email = email;
        this.hashedCode = hashedCode;
        this.isValidated = isValidated;
        this.id = id;
    }    
}