const UNSPLASH_API_KEY = "cab540f58939ad433ba2519d08ddfac649e932d15c0d75bc9412cd9b83cdbc8b"
const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_API_KEY}&query=landscape&orientation=landscape`;

const body = document.querySelector("body"),
locationContainer = document.querySelector(".js-location span");

function loadBackground() {
    const savedImage = localStorage.getItem("bg");
    if (savedImage === null) {
        getBackground();
    } else {
        const parsedImage = JSON.parse(savedImage);
        const today = new Date();

        if (today.getTime() > new Date(parsedImage.expiresOn).getTime()) {
            getBackground();
        } else {
            body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${parsedImage.url})`; // 참고 : https://stackoverflow.com/questions/2504071/how-do-i-combine-a-background-image-and-css3-gradient-on-the-same-element
            locationContainer.innerHTML = `${parsedImage.name}, ${parsedImage.city}, ${parsedImage.country}`;
        }
    }
    return;
}

function saveBackgound(imageUrl, city, country, name) {
    const savedImage = localStorage.getItem("bg");
    if (savedImage !== null) {
        localStorage.removeItem("bg");
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    
    const imageObject = {
        url: imageUrl,
        expiresOn: expirationDate,
        city,
        country,
        name
    };

    localStorage.setItem("bg", JSON.stringify(imageObject));
    loadBackground();
    return;
}

function getBackground() {
    fetch(UNSPLASH_URL)
    .then(response => {return response.json()}) // readableStream에서 데이터를 읽기 위해서는 .json과 같은 conversion 메소드 중 하나를 써야 한다.
                                                // 참고 : https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
    .then(json => {
        if (json === undefined || json === null) {
            saveBackgound("images/2.jpg", "Seoul", "Korea", "Highway"); // 2번 이미지 지정 
            return;
        }
        const image = json;
        if(image.urls && image.urls.full) {
            const fullUrl = image.urls.full;
            const location = image.location;

            if (location) {
                city = location.city || "seoul";
                country = location.country || "korea";
                name = location.name || "famous_place";
            }

            saveBackgound(fullUrl, city, country, name);
        }
    });
    return;
}

function initApp() {
    loadBackground();
    return;
}

initApp();