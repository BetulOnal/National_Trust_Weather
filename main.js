(async function() {
    // Constants
    const COOKIE_NAME = '__uzmaj3';
    const API_ENDPOINT = 'https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast';
    const APP_ID = 'a2ef86c41a';
    const TRACKING_ENDPOINT = 'https://our-api-endpoint.com'; // API to track results

   /**
     * Retrieves the value of a specific cookie from the browser.
     * @param {string} name - The name of the cookie.
     * @returns {string|null} - The value of the cookie. Returns `null` if the cookie does not exist.
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
        return null;
    }

    // hash a string
    function hashString(str) {
        return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    /**
     * Assigns the user to either group A or B based on their user ID.
     * @param {string} userId - The user's ID.
     * @returns {string} - The group the user is assigned to ("A" or "B").
     */
    function getTestGroup(userId) {
        const hash = hashString(userId);
        return hash % 2 === 0 ? 'A' : 'B';
    }

    /**
     * Fetches weather data from the API for a specific location.
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @returns {Promise<Object>} - A Promise containing the weather data.
     * @throws {Error} - Throws an error if the API call fails.
     */
    async function fetchWeatherData(latitude, longitude) {
        const url = `${API_ENDPOINT}?appid=${APP_ID}&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return response.json();
    }

    // create a weather card
    function createWeatherCard(time, weather, temp) {
        const weatherIcon = getWeatherIcon(weather);
        return `
            <div class="weather-card">
                <div class="weather-time">${time}</div>
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-info">${weather}</div>
                <div class="weather-temp">${temp}</div>
            </div>
        `;
    }

    // get a weather icon based on the description
    function getWeatherIcon(weatherDescription) {
        if (weatherDescription.includes('rain')) return '⛈️';
        if (weatherDescription.includes('cloud')) return '☁️';
        if (weatherDescription.includes('sun')) return '🌞';
        return '🌈';
    }

     /**
     * Injects CSS styles into the document for the weather cards.
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .weather-info {
                display: flex;
                justify-content: center;
                gap: 40px;
                flex-wrap: wrap;
            }
            .weather-card {
                background-color: rgb(237 236 233);
                text-align: center;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 8px;
                width: 80px;
                box-sizing: border-box;
                margin: 2px;
            }
            .weather-time {
                font-size: 18px;
                font-weight: bold;
            }
            .weather-icon {
                font-size: 24px;
                margin: 10px 0;
            }
            .weather-info {
                font-size: 16px;
                margin: 10px 0;
            }
            .weather-temp {
                font-size: 18px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Tracks user actions (e.g., button clicks) by sending data to a server.
     * @param {string} userGroup - The group the user belongs to ("A" or "B").
     * @param {string} action - The action performed by the user (e.g., "button_click").
     * @returns {Promise<void>} - A Promise that resolves when the tracking data is sent.
     */
    async function trackClick(userGroup, action) {
        const data = {
            userGroup: userGroup,
            action: action,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(TRACKING_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error('Failed to track click:', response.statusText);
            }
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    }

    // Main function
    async function main() {
        const userId = getCookie(COOKIE_NAME);
        if (!userId) {
            console.error("User ID not found in cookies.");
            return;
        }

        const userGroup = getTestGroup(userId);
        if (userGroup === "B") {
            console.log("Weather is not displayed (User is in Group B)");
            return;
        }

        try {
            const locationInfo = window.__NEXT_DATA__.props.pageProps.appContext.place.data.location.latitudeLongitude;
            if (!locationInfo) {
                console.error("Coordinates not found.");
                return;
            }

            const {
                latitude,
                longitude
            } = locationInfo;
            const weatherData = await fetchWeatherData(latitude, longitude);

            if (!weatherData?.list) {
                console.error("No weather data received.");
                return;
            }

            const lastThreeItems = weatherData.list.slice(-3).map(item => ({
                time: item.dt_txt.split(" ")[1].substring(0, 5),
                weather: item.weather[0].description,
                temp: item.main.temp.toFixed(1) + "°C"
            }));

            const placeSummaryLinksDiv = document.querySelector('.Placestyle__StyledPlaceSummaryLinks-sc-7yy3d-8.bBhRRC');
            if (!placeSummaryLinksDiv) {
                console.error("Target element for weather link not found.");
                return;
            }

            const ulElement = placeSummaryLinksDiv.querySelector('ul');
            const newLi = document.createElement('li');
            newLi.innerHTML = `
                <a href="#place-weather" id="weather-info-link" class="Linkstyle__StyledLink-sc-1dp2vo7-3 bSoROX has-endIcon">
                    <span class="Linkstyle__LabelText-sc-1dp2vo7-0 kBebOv">Weather Information</span>
                    <span class="Linkstyle__LabelIcon-sc-1dp2vo7-1 ecwYtg">
                        <span class="Iconstyle__SVGWrapper-sc-461blh-0 eoSxjx">
                            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="100%" height="100%">
                                <g>
                                    <path d="M10.86,12.37L1.5,3.01L3.01,1.5l9.36,9.36V1.72h2.13V14.5H1.72v-2.13H10.86z"></path>
                                </g>
                            </svg>
                        </span>
                    </span>
                </a>`;
            ulElement.appendChild(newLi);

            const weatherContainer = document.createElement('div');
            weatherContainer.className = "weather-info";
            weatherContainer.style.display = "none";
            weatherContainer.innerHTML = lastThreeItems.map(item => createWeatherCard(item.time, item.weather, item.temp)).join('');

            ulElement.parentNode.appendChild(weatherContainer);

            document.getElementById("weather-info-link").addEventListener('click', function(event) {
                event.preventDefault();
                weatherContainer.style.display = weatherContainer.style.display === 'none' ? 'flex' : 'none';
                trackClick(userGroup, 'weather_info_click'); // Tıklama verisini gönder
            });

            injectStyles();
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
    main();
})();