searchHistory = [
    "San Diego",
    "New York City",
    "Sao Paulo",
    "Prague",
    "Shibuya"
];

for (i = 0; i < searchHistory.length; i++) {
    let div = $("<div>")
        .addClass("prev-search-queries py-2")
        .text(searchHistory[i]);
    $("#search-history").append(div);
}

$("#city-search-field").focus();

let apiKey = "d8da2da3039bec3b4cab3e48675fc451";

function renderCurrentForecast(city) {
    let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&APPID=" +
        apiKey;

    let uvIndex;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        console.log(data);

        let date = moment().format("M[/]D[/]YY");

        let dateSpan = $("<span>")
            .attr("id", "currentDate")
            .text(" (" + date + ")");

        $("#city")
            .text(data.name)
            .append(dateSpan);
        $("#temp").text("temperature: " + Math.round(data.main.temp) + " °F");
        $("#humidity").text("humidity: " + data.main.humidity + "%");
        $("#wind-speed").text("wind speed: " + data.wind.speed + " mph");

        let htmlString = "uv index: <span id='uv-index'></span>";
        $("#uv-index-parent").html(htmlString);

        $("#five-day-header").text("5-day forecast:");

        // get UV index
        $.ajax({
            url:
                "https://api.openweathermap.org/data/2.5/uvi?" +
                "lat=" +
                data.coord.lat +
                "&lon=" +
                data.coord.lon +
                "&APPID=d8da2da3039bec3b4cab3e48675fc451",
            method: "GET"
        }).then(function(data) {
            $("#uv-index").text(data.value);
            setUVIndexBackgroundColor(data.value);
        });
    });
}

function render5DayForecast(city) {
    let queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=imperial&APPID=" +
        apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data) {
        console.log(data);
        $("#five-day-container").empty();

        let j = 0;
        for (let i = 3; i <= 35; i += 8) {
            let temp = Math.round(data.list[i].main.temp);
            let date = moment()
                .add(j + 1, "days")
                .format("M[/]D[/]YY");
            let humidity = data.list[i].main.humidity;
            let weather_icon;

            switch (data.list[i].weather[0].main) {
                case "Clear":
                    weather_icon = "clear.png";
                    break;
                case "Clouds":
                    weather_icon = "clouds.png";
                    break;
                case "Thunderstorm":
                    weather_icon = "thunderstorm.png";
                    break;
                case "Drizzle":
                    weather_icon = "drizzle.png";
                case "Rain":
                    weather_icon = "rain.png";
                    break;
                case "Snow":
                    weather_icon = "snow.png";
                    break;
                default:
                    weather_icon = "clouds.png";
            }

            let forecastTile = $("<div>")
                .addClass("forecast-tile")
                .attr("data-day", [j]);
            let dateDiv = $("<div>")
                .addClass("forecast-date p-2")
                .text(date);
            let img = $("<img>")
                .addClass("forecast-img m-2")
                .attr("src", "assets/" + weather_icon);
            let tempDiv = $("<div>")
                .addClass("forecast-temp p-2")
                .text(temp + " °F");
            let humidityDiv = $("<div>")
                .addClass("forecast humidity p-2")
                .text(humidity + "%");

            forecastTile.append(dateDiv, img, tempDiv, humidityDiv);
            $("#five-day-container").append(forecastTile);
            j++;
        }
    });
}

function renderSearchHistory() {
    searchHistory.unshift($("#city-search-field").val());
    searchHistory.pop();
    $("#search-history").empty();

    for (i = 0; i < searchHistory.length; i++) {
        let div = $("<div>")
            .addClass("prev-search-queries py-2")
            .text(searchHistory[i]);
        $("#search-history").append(div);
    }
}

function setUVIndexBackgroundColor (uvIndex) {
    if (uvIndex < 3) {
        $("#uv-index").attr("style", "background: #b4ffa7");
    }

    else if (uvIndex > 3 && uvIndex < 5) {
        $("#uv-index").attr("style", "background: #f9f871"); 
    }

    else if (uvIndex > 5 && uvIndex < 7) {
        $("#uv-index").attr("style", "background: #fbbea3");
    }

    else if (uvIndex > 7 && uvIndex < 10) {
        $("#uv-index").attr("style", "background: #ff4646; color: #ffffff");
    }

    else if (uvIndex > 10) {
        $("#uv-index").attr("style", "background: #814f6a; color: #ffffff");
    }
}

$("#submit").on("click", function(event) {
    // event.preventDefault();
    city = $("#city-search-field").val();
    renderCurrentForecast(city);
    render5DayForecast(city);
    renderSearchHistory();
    $("#city-search-field").val("");
    return false;
});

$("#search-history").on("click", ".prev-search-queries", function() {
    city = this.textContent;
    renderCurrentForecast(city);
    render5DayForecast(city);
});
