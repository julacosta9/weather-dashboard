searchHistory = [
    "San Diego",
    "New York City",
    "Sao Paulo",
    "Prague",
    "Shibuya",
];

for (i=0; i < searchHistory.length; i++) {
    let div = $("<div>").addClass("prev-search-queries py-2").text(searchHistory[i]);
    $("#search-history").append(div)
}

let city;
let apiKey = "d8da2da3039bec3b4cab3e48675fc451";

function renderCurrentForecast() {
    let queryURL =
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&APPID=" +
        apiKey;

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
        $("#temp").text(Math.round(data.main.temp) + " °F");
        $("#humidity").text(data.main.humidity + "%");
        $("#wind-speed").text(data.wind.speed + " mph");
        $("#uv-index").text("FIND UV INDEX");
    });
}

function render5DayForecast() {
    let queryURL =
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
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

            let forecastSquare = $("<div>")
                .addClass("col-2-sm forecast-square")
                .attr("data-day", [j]);
            let dateDiv = $("<div>")
                .addClass("forecast-date p-2")
                .text(date);
            let img = $("<img>")
                .addClass("forecast-img m-2")
                .attr("src", "/assets/" + weather_icon);
            let tempDiv = $("<div>")
                .addClass("forecast-temp p-2")
                .text(temp + " °F");
            let humidityDiv = $("<div>")
                .addClass("forecast humidity p-2")
                .text(humidity + "%");

            forecastSquare.append(dateDiv, img, tempDiv, humidityDiv);
            $("#five-day-container").append(forecastSquare);
            j++;
        }
    });
}

function renderSearchHistory () {
    searchHistory.unshift($("#city-search-field").val());
    searchHistory.pop();
    $("#search-history").empty();


    for (i=0; i < searchHistory.length; i++) {
        let div = $("<div>").addClass("prev-search-queries py-2").text(searchHistory[i]);
        $("#search-history").append(div)
    }
}

$("#submit").on("click", function(event) {
    event.preventDefault();
    city = $("#city-search-field").val();
    renderCurrentForecast();
    render5DayForecast();
    renderSearchHistory();
    $("#city-search-field").val("");
});

$("#search-history").on("click", ".prev-search-queries", function () {
    city = this.textContent;
    renderCurrentForecast();
    render5DayForecast();
})