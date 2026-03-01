import { Command } from "commander";
import axios from "axios";
import CommandHandler from "./CommandHandler";
import { success, error, label, header, divider, info } from "../utils/display";
import chalk from "chalk";
// ora is a CommonJS module
const ora = require("ora");

/**
 * APICommands — integrates with 5 external APIs.
 * Commands: joke, quote, weather, github, crypto
 */
class APICommands extends CommandHandler {
    constructor() {
        super("api", "Commands powered by external APIs");
    }

    register(program: Command): void {
        // ── 1. JOKE ─────────────────────────────────────────
        program
            .command("joke")
            .description("Fetch a random joke (Official Joke API)")
            .action(async () => {
                const spinner = ora(chalk.cyan("Fetching a joke...")).start();
                try {
                    const res = await axios.get(
                        "https://official-joke-api.appspot.com/random_joke"
                    );
                    spinner.stop();
                    header("Random Joke 😂");
                    console.log(chalk.yellowBright("  Q: ") + chalk.white(res.data.setup));
                    console.log(chalk.greenBright("  A: ") + chalk.white(res.data.punchline));
                } catch {
                    spinner.stop();
                    error("Could not fetch a joke. Check your internet connection.");
                }
            });

        // ── 2. QUOTE ────────────────────────────────────────
        program
            .command("quote")
            .description("Fetch a random inspirational quote (Quotable API)")
            .action(async () => {
                const spinner = ora(chalk.cyan("Fetching a quote...")).start();
                try {
                    const res = await axios.get("https://api.quotable.io/random");
                    spinner.stop();
                    header("Random Quote 💬");
                    console.log(chalk.white(`  "${res.data.content}"`));
                    console.log(chalk.gray(`  — ${res.data.author}`));
                } catch {
                    spinner.stop();
                    error("Could not fetch a quote. The Quotable API may be down.");
                }
            });

        // ── 3. WEATHER ──────────────────────────────────────
        program
            .command("weather <city>")
            .description("Get the current weather for a city (Open-Meteo + Geocoding)")
            .action(async (city: string) => {
                const spinner = ora(chalk.cyan(`Looking up weather for "${city}"...`)).start();
                try {
                    // Step 1: Geocoding
                    const geoRes = await axios.get(
                        "https://geocoding-api.open-meteo.com/v1/search",
                        { params: { name: city, count: 1, language: "en", format: "json" } }
                    );
                    if (!geoRes.data.results || geoRes.data.results.length === 0) {
                        spinner.stop();
                        error(`City "${city}" not found. Try a different spelling.`);
                        return;
                    }
                    const { latitude, longitude, name, country } = geoRes.data.results[0];

                    // Step 2: Weather
                    const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
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
                    const codeMap: Record<number, string> = {
                        0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
                        45: "Foggy 🌫️", 48: "Icy fog 🌫️", 51: "Light drizzle 🌦️", 53: "Drizzle 🌦️",
                        61: "Light rain 🌧️", 63: "Rain 🌧️", 65: "Heavy rain 🌧️",
                        71: "Light snow ❄️", 73: "Snow ❄️", 75: "Heavy snow ❄️",
                        95: "Thunderstorm ⛈️", 99: "Thunderstorm with hail ⛈️",
                    };
                    const condition = codeMap[w.weathercode] ?? "Unknown";
                    const windDir = (deg: number) => {
                        const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
                        return dirs[Math.round(deg / 45) % 8];
                    };

                    header(`Weather in ${name}, ${country} 🌍`);
                    label("Condition", condition);
                    label("Temperature", `${w.temperature}°C`);
                    label("Wind Speed", `${w.windspeed} km/h ${windDir(w.winddirection)}`);
                    label("Coordinates", `${latitude}°N, ${longitude}°E`);
                } catch {
                    spinner.stop();
                    error("Could not fetch weather data. Check your internet connection.");
                }
            });

        // ── 4. GITHUB ───────────────────────────────────────
        program
            .command("github <username>")
            .description("Fetch a GitHub user's public profile info (GitHub REST API)")
            .action(async (username: string) => {
                const spinner = ora(chalk.cyan(`Fetching GitHub profile for @${username}...`)).start();
                try {
                    const res = await axios.get(`https://api.github.com/users/${username}`, {
                        headers: { Accept: "application/vnd.github.v3+json" },
                    });
                    spinner.stop();
                    const u = res.data;
                    header(`GitHub Profile: @${u.login} 🐙`);
                    label("Name", u.name ?? "N/A");
                    label("Bio", u.bio ?? "N/A");
                    label("Location", u.location ?? "N/A");
                    label("Company", u.company ?? "N/A");
                    label("Public Repos", u.public_repos);
                    label("Followers", u.followers);
                    label("Following", u.following);
                    label("Account Created", new Date(u.created_at).toLocaleDateString());
                    divider();
                    info(`Profile URL: ${u.html_url}`);
                } catch (err: any) {
                    spinner.stop();
                    if (err?.response?.status === 404) {
                        error(`GitHub user "@${username}" not found.`);
                    } else {
                        error("Could not fetch GitHub profile. Check your internet connection.");
                    }
                }
            });

        // ── 5. CRYPTO ───────────────────────────────────────
        program
            .command("crypto <coin>")
            .description("Get live price & market data for a cryptocurrency (CoinGecko API)")
            .action(async (coin: string) => {
                const spinner = ora(chalk.cyan(`Fetching crypto data for "${coin}"...`)).start();
                try {
                    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
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
                        error(`Coin "${coin}" not found. Try names like: bitcoin, ethereum, dogecoin`);
                        return;
                    }
                    const change = data.usd_24h_change?.toFixed(2);
                    const changeColor = parseFloat(change) >= 0 ? chalk.greenBright : chalk.redBright;
                    header(`${coin.toUpperCase()} Price 📈`);
                    label("Price (USD)", `$${data.usd.toLocaleString()}`);
                    label("Market Cap", `$${data.usd_market_cap?.toLocaleString() ?? "N/A"}`);
                    label("24h Volume", `$${data.usd_24h_vol?.toLocaleString() ?? "N/A"}`);
                    console.log(chalk.yellow.bold("24h Change:") + " " + changeColor(`${change}%`));
                } catch {
                    spinner.stop();
                    error("Could not fetch crypto data. CoinGecko API may be rate-limited.");
                }
            });
    }
}

export default APICommands;
