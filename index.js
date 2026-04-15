const loader = document.querySelector("#loading");
let mymap = null;

function displayLoading() {
    loader.classList.add("display");
}

function hideLoading() {
    loader.classList.remove("display");
}

const ipTracker = {
    fetchIp(ipAddress) {
        displayLoading();

        fetch(`/api/ip?ip=${encodeURIComponent(ipAddress)}`)
            .then((response) =>
                response.json().then((data) => {
                    if (!response.ok) {
                        throw new Error(data.messages || data.message || "API request failed");
                    }
                    return data;
                })
            )
            .then((data) => {
                if (!data.location) {
                    throw new Error("No location data returned");
                }

                this.displayData(data);
            })
            .catch((error) => this.handleErrors(error))
            .finally(() => hideLoading());
    },

    displayData(data) {
        const { lat, lng, city, country, region, timezone } = data.location;
        const { ip, isp } = data;

        if (mymap) {
            mymap.remove();
        }

        mymap = L.map("mapid").setView([lat, lng], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(mymap);

        L.marker([lat, lng]).addTo(mymap);

        document.querySelector("#ipaddresss").textContent = ip || "--";
        document.querySelector("#location").textContent = `${city || "--"}, ${country || "--"}, ${region || "--"}`;
        document.querySelector("#timezone").textContent = `UTC ${timezone || "--"}`;
        document.querySelector("#isp").textContent = isp || "--";
    },

    handleErrors(error) {
        console.error(error);

        document.querySelector("#ipaddresss").textContent = "--";
        document.querySelector("#location").textContent = "Unable to load location";
        document.querySelector("#timezone").textContent = "--";
        document.querySelector("#isp").textContent = error.message;
    },

    search() {
        const input = document.querySelector("#ip-input").value.trim();
        if (!input) return;

        this.fetchIp(input);
    },
};

document.querySelector("#search-btn").addEventListener("click", () => {
    ipTracker.search();
});

ipTracker.fetchIp("8.8.8.8");
