// Config
Wat.C = {
    login: 'superadmin',
    login: 'benja',
    password: '',
    loggedIn: true,
    apiUrl: 'http://172.20.126.12:3000/',

    getBaseUrl: function () {
        return this.apiUrl + "?login=" + this.login + "&password=" + this.password;
    },
    
    isSuperadmin: function () {
        return this.login == 'superadmin';
    }
}