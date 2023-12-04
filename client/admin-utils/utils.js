export function saveJWTAdmin(jwtToken) {
    window.localStorage.setItem('jwt_token_admin', jwtToken);
}

export function getJWTAdmin() {
    return window.localStorage.getItem('jwt_token_admin');
}

export function saveAdmin(role) {
    window.localStorage.setItem('jwtAdmin', role);
}

export function getAdmin() {
    return window.localStorage.getItem('jwtAdmin');  //Role check Admin or Doctor
}

export function deleteAdminToken() {
    window.localStorage.removeItem('jwt_token_admin');
    window.localStorage.removeItem('jwtAdmin');
}
