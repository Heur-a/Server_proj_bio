export class UserUpdate {
    constructor(id, firstName, lastName1, lastName2, telephone) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName1 = lastName1;
        this.lastName2 = lastName2;
        this.telephone = telephone;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName1} ${this.lastName2}`;
    }

    


}