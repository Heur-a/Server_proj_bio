export class UserUpdate {
    /**
     * Creates an instance of UserUpdate.
     * @param {number} id - The user's ID.
     * @param {string} name - The user's first name.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param {string} lastName1 - The user's first last name.
     * @param {string} lastName2 - The user's second last name.
     * @param {string} tel - The user's telephone number.
     */
    constructor(id, name, email, password, lastName1, lastName2, tel) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName1 = lastName1;
        this.lastName2 = lastName2;
        this.tel = tel;
    }

    /**
     * Gets the user's full name.
     * @returns {string} The user's full name.
     */
    getFullName() {
        return `${this.name} ${this.lastName1} ${this.lastName2}`;
    }

    /**
     * Builder class for UserUpdate.
     */
    static Builder = class {
        constructor() {
            this.user = new UserUpdate();
        }
    
        setId(id) {
            if (id == null) {
                throw new Error("ID is required and cannot be null or undefined.");
            }
            this.user.id = id;
            return this;
        }
    
        setName(name) {
            if (name != null) {
                this.user.name = name;
            }
            return this;
        }
    
        setEmail(email) {
            if (email != null) {
                this.user.email = email;
            }
            return this;
        }
    
        setPassword(password) {
            if (password != null) {
                this.user.password = password;
            }
            return this;
        }
    
        setLastName1(lastName1) {
            if (lastName1 != null) {
                this.user.lastName1 = lastName1;
            }
            return this;
        }
    
        setLastName2(lastName2) {
            if (lastName2 != null) {
                this.user.lastName2 = lastName2;
            }
            return this;
        }
    
        setTel(tel) {
            if (tel != null) {
                this.user.tel = tel;
            }
            return this;
        }
    
        build() {
            if (this.user.id == null) {
                throw new Error("Cannot build UserUpdate: ID is required.");
            }
            return this.user;
        }
    }
    
}