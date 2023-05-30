let cookie;

const rgbInput = document.querySelector("#rgb");
const pfpSwitch = document.querySelector("#pfp");
const darkSwitch = document.querySelector("#dark")

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

rgbInput.addEventListener("change", () => {
    chrome.storage.sync.set({
        rgb_speed: Number(rgbInput.value)
    })
})

pfpSwitch.addEventListener("click", () => {
    chrome.storage.sync.set({
        pfp: pfpSwitch.checked
    })
})

darkSwitch.addEventListener("click", () => {
    chrome.storage.sync.set({
        dark_mode: darkSwitch.checked
    })
})

chrome.storage.sync.get(["rgb_speed", "pfp", "dark_mode"]).then((result) => {
    if (result.rgb_speed) {
        rgbInput.value = result.rgb_speed;
    } else {
        rgbInput.value = 1;
    }
    if (result.pfp) {
        pfpSwitch.checked = result.pfp;
    } else {
        pfpSwitch.checked = false;
    }
    if (result.dark_mode) {
        darkSwitch.checked = result.dark_mode;
    } else {
        darkSwitch.checked = false;
    }
});