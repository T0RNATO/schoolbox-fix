let cookie;

const input = document.querySelector("#rgb");

function unlink() {
    fetch("https://api.coolbox.lol/discord", {method: "DELETE", headers: new Headers({
        "Authorization": "Bearer " + cookie,
        "Content-Type": "application/json"
    })}).then(response => {
        if (response.ok) {
            alert("Successfully deauthenticated");
            button.removeEventListener("click", unlink);
            button.classList.remove("danger");
            button.innerText = "Link Discord";
            button.addEventListener("click", link);
        }
    })
}

function link() {
    chrome.tabs.create({
        url: "https://api.coolbox.lol/discord/redirect?state=" + cookie
    })
}

const button = document.querySelector("#unlink");
chrome.runtime.sendMessage("getCookie", (cook) => {
    try {
        cookie = cook.value;
        fetch("https://api.coolbox.lol/user", {method: "GET", headers: new Headers({
            "Authorization": "Bearer " + cookie,
            "Content-Type": "application/json"
        })}).then(response => {response.json().then(data => {
            button.classList.remove("hide");
            if (data.discord.linked) {
                button.classList.add("danger");
                button.innerText = "Unlink Discord"

                button.addEventListener("click", unlink)

            } else {
                button.innerText = "Link Discord";
                button.addEventListener("click", link)
            }
        })})
    } catch {
        document.querySelector("#authError").innerText = "Cannot authenticate, you \nare not logged in!";
    }
})

input.addEventListener("mouseup", () => {
    chrome.storage.sync.set({
        rgb_speed: Number(input.value)
    })
})

chrome.storage.sync.get(["rgb_speed"]).then((result) => {
    input.value = result.rgb_speed;
});