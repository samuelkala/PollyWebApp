function setCookie(name, value) {
    let cookie = name + "=" + encodeURIComponent(value);
    cookie += "; max-age=" + (365 * 24 * 60 * 60);
    document.cookie = cookie;
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
