"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const CommandHandler_1 = __importDefault(require("./CommandHandler"));
const display_1 = require("../utils/display");
const chalk_1 = __importDefault(require("chalk"));
// ora is a CommonJS module
const ora = require("ora");
/**
 * APICommands — integrates with 5 external APIs.
 * Commands: joke, quote, weather, github, crypto
 */
class APICommands extends CommandHandler_1.default {
    constructor() {
        super("api", "Commands powered by external APIs");
    }
    register(program) {
        // ── 1. JOKE ─────────────────────────────────────────
        program
            .command("joke")
            .description("Fetch a random joke (Official Joke API)")
            .action(async () => {
            const spinner = ora(chalk_1.default.cyan("Fetching a joke...")).start();
            try {
                const res = await axios_1.default.get("https://official-joke-api.appspot.com/random_joke");
                spinner.stop();
                (0, display_1.header)("Random Joke 😂");
                console.log(chalk_1.default.yellowBright("  Q: ") + chalk_1.default.white(res.data.setup));
                console.log(chalk_1.default.greenBright("  A: ") + chalk_1.default.white(res.data.punchline));
            }
            catch {
                spinner.stop();
                (0, display_1.error)("Could not fetch a joke. Check your internet connection.");
            }
        });
        // ── 2. QUOTE ────────────────────────────────────────
        program
            .command("quote")
            .description("Fetch a random inspirational quote (Quotable API)")
            .action(async () => {
            const spinner = ora(chalk_1.default.cyan("Fetching a quote...")).start();
            try {
                const res = await axios_1.default.get("https://api.quotable.io/random");
                spinner.stop();
                (0, display_1.header)("Random Quote 💬");
                console.log(chalk_1.default.white(`  "${res.data.content}"`));
                console.log(chalk_1.default.gray(`  — ${res.data.author}`));
            }
            catch {
                spinner.stop();
                (0, display_1.error)("Could not fetch a quote. The Quotable API may be down.");
            }
        });
        // ── 3. WEATHER ──────────────────────────────────────
        program
            .command("weather <city>")
            .description("Get the current weather for a city (Open-Meteo + Geocoding)")
            .action(async (city) => {
            var _a;
            const spinner = ora(chalk_1.default.cyan(`Looking up weather for "${city}"...`)).start();
            try {
                // Step 1: Geocoding
                const geoRes = await axios_1.default.get("https://geocoding-api.open-meteo.com/v1/search", { params: { name: city, count: 1, language: "en", format: "json" } });
                if (!geoRes.data.results || geoRes.data.results.length === 0) {
                    spinner.stop();
                    (0, display_1.error)(`City "${city}" not found. Try a different spelling.`);
                    return;
                }
                const { latitude, longitude, name, country } = geoRes.data.results[0];
                // Step 2: Weather
                const weatherRes = await axios_1.default.get("https://api.open-meteo.com/v1/forecast", {
                    params: {
                        latitude,
                        longitude,
                        current_weather: true,
                        hourly: "relativehumidity_2m",
                        timezone: "auto",
                    },
                });
                spinner.stop();
                const w = weatherRes.data.current_weather;
                const codeMap = {
                    0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
                    45: "Foggy 🌫️", 48: "Icy fog 🌫️", 51: "Light drizzle 🌦️", 53: "Drizzle 🌦️",
                    61: "Light rain 🌧️", 63: "Rain 🌧️", 65: "Heavy rain 🌧️",
                    71: "Light snow ❄️", 73: "Snow ❄️", 75: "Heavy snow ❄️",
                    95: "Thunderstorm ⛈️", 99: "Thunderstorm with hail ⛈️",
                };
                const condition = (_a = codeMap[w.weathercode]) !== null && _a !== void 0 ? _a : "Unknown";
                const windDir = (deg) => {
                    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
                    return dirs[Math.round(deg / 45) % 8];
                };
                (0, display_1.header)(`Weather in ${name}, ${country} 🌍`);
                (0, display_1.label)("Condition", condition);
                (0, display_1.label)("Temperature", `${w.temperature}°C`);
                (0, display_1.label)("Wind Speed", `${w.windspeed} km/h ${windDir(w.winddirection)}`);
                (0, display_1.label)("Coordinates", `${latitude}°N, ${longitude}°E`);
            }
            catch {
                spinner.stop();
                (0, display_1.error)("Could not fetch weather data. Check your internet connection.");
            }
        });
        // ── 4. GITHUB ───────────────────────────────────────
        program
            .command("github <username>")
            .description("Fetch a GitHub user's public profile info (GitHub REST API)")
            .action(async (username) => {
            var _a, _b, _c, _d, _e;
            const spinner = ora(chalk_1.default.cyan(`Fetching GitHub profile for @${username}...`)).start();
            try {
                const res = await axios_1.default.get(`https://api.github.com/users/${username}`, {
                    headers: { Accept: "application/vnd.github.v3+json" },
                });
                spinner.stop();
                const u = res.data;
                (0, display_1.header)(`GitHub Profile: @${u.login} 🐙`);
                (0, display_1.label)("Name", (_a = u.name) !== null && _a !== void 0 ? _a : "N/A");
                (0, display_1.label)("Bio", (_b = u.bio) !== null && _b !== void 0 ? _b : "N/A");
                (0, display_1.label)("Location", (_c = u.location) !== null && _c !== void 0 ? _c : "N/A");
                (0, display_1.label)("Company", (_d = u.company) !== null && _d !== void 0 ? _d : "N/A");
                (0, display_1.label)("Public Repos", u.public_repos);
                (0, display_1.label)("Followers", u.followers);
                (0, display_1.label)("Following", u.following);
                (0, display_1.label)("Account Created", new Date(u.created_at).toLocaleDateString());
                (0, display_1.divider)();
                (0, display_1.info)(`Profile URL: ${u.html_url}`);
            }
            catch (err) {
                spinner.stop();
                if (((_e = err === null || err === void 0 ? void 0 : err.response) === null || _e === void 0 ? void 0 : _e.status) === 404) {
                    (0, display_1.error)(`GitHub user "@${username}" not found.`);
                }
                else {
                    (0, display_1.error)("Could not fetch GitHub profile. Check your internet connection.");
                }
            }
        });
        // ── 5. CRYPTO ───────────────────────────────────────
        program
            .command("crypto <coin>")
            .description("Get live price & market data for a cryptocurrency (CoinGecko API)")
            .action(async (coin) => {
            var _a, _b, _c, _d, _e;
            const spinner = ora(chalk_1.default.cyan(`Fetching crypto data for "${coin}"...`)).start();
            try {
                const res = await axios_1.default.get("https://api.coingecko.com/api/v3/simple/price", {
                    params: {
                        ids: coin.toLowerCase(),
                        vs_currencies: "usd",
                        include_market_cap: true,
                        include_24hr_change: true,
                        include_24hr_vol: true,
                    },
                });
                spinner.stop();
                const data = res.data[coin.toLowerCase()];
                if (!data) {
                    (0, display_1.error)(`Coin "${coin}" not found. Try names like: bitcoin, ethereum, dogecoin`);
                    return;
                }
                const change = (_a = data.usd_24h_change) === null || _a === void 0 ? void 0 : _a.toFixed(2);
                const changeColor = parseFloat(change) >= 0 ? chalk_1.default.greenBright : chalk_1.default.redBright;
                (0, display_1.header)(`${coin.toUpperCase()} Price 📈`);
                (0, display_1.label)("Price (USD)", `$${data.usd.toLocaleString()}`);
                (0, display_1.label)("Market Cap", `$${(_c = (_b = data.usd_market_cap) === null || _b === void 0 ? void 0 : _b.toLocaleString()) !== null && _c !== void 0 ? _c : "N/A"}`);
                (0, display_1.label)("24h Volume", `$${(_e = (_d = data.usd_24h_vol) === null || _d === void 0 ? void 0 : _d.toLocaleString()) !== null && _e !== void 0 ? _e : "N/A"}`);
                console.log(chalk_1.default.yellow.bold("24h Change:") + " " + changeColor(`${change}%`));
            }
            catch {
                spinner.stop();
                (0, display_1.error)("Could not fetch crypto data. CoinGecko API may be rate-limited.");
            }
        });
    }
}
exports.default = APICommands;
