class UserPreferences {
    constructor() {
        this.transportModes = [];
        this.priority = '';
    }

    addTransportMode(mode) {
        if (!this.transportModes.includes(mode)) {
            this.transportModes.push(mode);
        }
    }

    removeTransportMode(mode) {
        this.transportModes = this.transportModes.filter(m => m !== mode);
    }
}

export default UserPreferences;
