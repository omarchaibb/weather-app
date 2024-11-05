
const baseUrl = "https://api.open-meteo.com/v1/forecast?";
const WEATHER_API_KEY = "e0e73a11abd34d17a62232425240411";
const PHOTO_API_KEY =
  "ziD7Qbi5GT7ks3qyNPSZaNxf5YHRI7GG4QK46G8nHRkUZMzOOigBukpD";

const WEATHER_API = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&`;
const PHOTO_API = `https://api.pexels.com/v1/search?query=`;
const citySelect = document.getElementById("city"),
  tempElement = document.getElementById("temp"),
  todayNameElement = document.getElementById("today"),
  weather_imageElement = document.querySelectorAll(".weather_image"),
  today_timeElement = document.getElementById("today_time"),
  conditionElement = document.getElementById("condition"),
  rainElement = document.getElementById("rain_mm"),
  cityImageElement = document.getElementById("city_image"),
  coutry_and_city = document.getElementById("coutry_and_city"),
  content = document.querySelector(".container"),
  skeleton = document.getElementById("skeleton_container"),
  cards = document.querySelector(".cards"),
  wrapper = document.querySelector(".wrapper"),
  image_city = document.querySelector(".image_city"),
  buttons = document.querySelector(".buttons"),
  week_forecast = document.getElementById("week_forecast");

// const
citySelect.addEventListener("change", (event) =>
  handleInputChange(event.target)
);

const handleInputChange = (event) => {
  const values = event.value;
  const city = event.options[event.selectedIndex].innerHTML;
  const [latitude, longitude] = values.split(",");
  if (latitude && longitude) {
    return request(city, latitude, longitude);
  }
};

const request = async (city, latitude, longitude) => {
  if (skeleton.classList.contains("hidden")) {
    skeleton.classList.remove("hidden");
    content.classList.add("hidden");
  }
  await getPhoto(city);
  await getWeather(latitude, longitude);
  skeleton.classList.add("hidden");
  content.classList.remove("hidden");
};

const getWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${WEATHER_API}q=${latitude},${longitude}&days=7&aqi=yes&alerts=no`
    )
      .then((response) => response.json())
      .then((data) => data);
    renderCentent(response);
    renderWeedForecast(response);
  } catch (error) {
    console.error(error);
  }
};

const getPhoto = async (city) => {
  try {
    const response = await fetch(`${PHOTO_API}${city}&per_page=1`, {
      headers: {
        Authorization: PHOTO_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
    renderPhoto(response);
  } catch (error) {
    return error;
  }
};

const renderPhoto = (data) => {
  if (data.photos.length > 0) {
    image_city.innerHTML = `          <img src="${data.photos[0].src.original}" alt="" id="city_image" />
    `;
  } else {
    image_city.innerHTML =
      "<img src='https://preview.redd.it/x-plane-12-default-weather-engine-keeps-improving-live-v0-dtwaydo0tdka1.png?width=640&crop=smart&auto=webp&s=aeded245f5690c21138c0249d54b51177844c323' />";
  }
};

const renderCentent = (data) => {
  const { current, location, forecast } = data;
  const epaDescriptions = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
  };
  const airQualiyDescripe =
    epaDescriptions[current.air_quality["us-epa-index"]];
  const airQuality = current.air_quality.co;

  const { country, localtime, name } = location;
  const { condition, temp_c, temp_f, wind_kph, last_updated, precip_mm } =
    current;
  const { icon, text } = condition;
  const daysforecast = forecast.forecastday;
  const [today, ...restDays] = daysforecast;
  const sunrise = today.astro.sunrise;
  const sunset = today.astro.sunset;

  const dailyNames = daysforecast.map((day) => {
    const dayNumber = new Date(day.date);
    return dayNumber.toLocaleDateString("en-Us", { weekday: "long" });
  });

  coutry_and_city.innerHTML = `${country} , ${name}`;
  hundleChangeToF(temp_c, temp_f);
  image_city;
  wrapper.innerHTML = `

        <div id="day_and_time">
          <span id="today">${dailyNames[0]}</span>
          <span id="today_time">${last_updated.slice(11)}</span>
        </div>

        <div class="divider"></div>

        <div class="condition">
          <div>
            <div>
              <img src="${icon}" alt="" class="weather_image" />
            </div>
            <span id="condition">${text}</span>
          </div>
          <div>
            <div>
              <img src="/img/Capture d’écran 2024-11-05 031443.png" alt="" />
            </div>
            <span id="rain_mm">${precip_mm}</span>
          </div>
        </div>
  `;

  tempElement.innerHTML = `${temp_c}°C`;

  weather_imageElement[0].src = icon;

  cards.innerHTML = `<div class="card">
              <h6>Wind Status</h6>
              <div>
                <span class="wind_speed">${wind_kph}</span>
                <span class="small">km/h</span>
              </div>
            </div>

            <div class="card">
              <h6>Sunrise & Sunset</h6>
              <div>
                <div class="sun_condition">
                  <div class="icon">
                    <img
                      src="/img/Capture d’écran 2024-11-05 045639.png"
                      alt=""
                      width="40px"
                    />
                  </div>
                  <span class="sun_time">${sunrise} AM</span>
                </div>
                <div class="sun_condition">
                  <div class="icon">
                    <img
                      src="/img/Capture d’écran 2024-11-05 045716.png"
                      alt=""
                      width="40px"
                    />
                  </div>
                  <span class="sun_time">${sunset} AM</span>
                </div>
              </div>
            </div>

            <div class="card">
              <h6>Air Quality</h6>
              <div>
                <span class="wind_speed">${airQuality}</span>
              </div>
              <span class="status">${airQualiyDescripe} </span>
            </div>
  `;

  gsap.from(".container", {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    ease: "power3.out",
  });

  gsap.from(".card", {
    duration: 1,
    opacity: 0,
    delay:2,
    y: 20,
    ease: "power3.out",
    stagger: 0.2,
  });

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.1, duration: 0.2 });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2 });
    });
  });

  gsap.from(".left_side", {
    duration: 1,
    x: -300,
    opacity: 0,
    ease: "power3.out",
  });

  gsap.to(".skeleton", {
    duration: 1.5,
    backgroundPosition: "200% 0",
    repeat: -1,
    ease: "linear",
  });
};

const hundleChangeToF = (temp_c, temp_f) => {
  const btns = buttons.querySelectorAll("button");

  btns.forEach((button) => {
    button.addEventListener("click", () => {
      btns.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      tempElementd =
        button.dataset.value === "°C" ? `${temp_c}°C` : `${temp_f}°F`;
      tempElement.innerHTML = tempElementd;
      console.log(tempElementd);
    });
  });
};

const renderWeedForecast = (data) => {
  const [today, ...restDays] = data.forecast.forecastday;

  week_forecast.innerHTML = restDays
    .map((day) => {
      const { icon } = day.day.condition;
      const { maxtemp_c, maxtemp_f, mintemp_c, mintemp_f } = day.day;
      date = new Date(day.date)
      day_name = date.toLocaleDateString("en-US" , {weekday:"long"})
      return `
      <div class="day_forecast">
            <span>${day_name}</span>
            <div>
              <img src="${icon}" alt="" />
            </div>
            <div class="min_max">
              <span class="max">${maxtemp_c}°C</span>
              <span class="min">${mintemp_c}°C</span>
            </div>
          </div>
      `;
    })
    .join("");
    const forecastItems = document.querySelectorAll('.day_forecast');
    gsap.from(forecastItems, {
      duration: 0.5,
      opacity: 0,
      delay:1,
      y: 20,
      stagger: 0.2,
      ease: "power3.out"
    });
};


