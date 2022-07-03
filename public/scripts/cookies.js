function setCookie(name, value) {
    // Encode value in order to escape semicolons, commas, and whitespace
    let cookie = name + "=" + encodeURIComponent(value);
    cookie += "; max-age=" + (365 * 24 * 60 * 60);
    document.cookie = cookie;
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    let cookieArr = document.cookie.split(";");
    let savedSettings;
    // Loop through the array elements
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if (name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            savedSettings = decodeURIComponent(cookiePair[1]);
            return JSON.parse(savedSettings);
        }
    }

    // Return null if not found
    return null;
}
