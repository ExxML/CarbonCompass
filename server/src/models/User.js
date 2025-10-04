import UserPreferences from './UserPreferences.js';

class User {
    constructor(userID, name, email) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.preferences = new UserPreferences();
    }

    getPreferences() {
        return this.preferences;
    }

    updatePreferences(pref) {
        this.preferences = pref;
    }
}

export default User;
