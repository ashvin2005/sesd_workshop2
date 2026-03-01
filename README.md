# MyCLI

A powerful, fully-featured Command Line Interface tool built with **Node.js** and **TypeScript**, structured using **Object-Oriented Programming** principles.

---

## Features

- **OOP Architecture** — Abstract base class with 4 command handler subclasses
- **17 Commands** across math, file system, APIs, and utilities
- **5 API Integrations** — Joke, Quote, Weather, GitHub, CoinGecko
- **Colored Terminal Output** — via `chalk`
- **Loading Spinners** — via `ora`
- **Table Output** — via `cli-table3`
- **Input Validation** on every command
- **Flags & Options** (e.g., `--shout`, `--lines`, `--length`, `--all`, `--count`)

---

## Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone <your-repo-url>
cd workshop_2
npm install
npm run build
npm link
```

---

## Available Commands

### Math Commands

| Command | Description |
|---|---|
| `mycli add <num1> <num2>` | Add two numbers |
| `mycli subtract <num1> <num2>` | Subtract two numbers |
| `mycli multiply <num1> <num2>` | Multiply two numbers |
| `mycli divide <num1> <num2>` | Divide two numbers (guards against ÷0) |
| `mycli modulo <num1> <num2>` | Remainder of division |
| `mycli power <base> <exp>` | Raise base to an exponent |
| `mycli factorial <num>` | Factorial of a non-negative integer |

### File Commands

| Command | Description |
|---|---|
| `mycli fileinfo <path>` | Show size, type, dates, and permissions |
| `mycli readfile <path>` | Print file contents (`--lines <n>` for first N lines) |
| `mycli listdir [path]` | List directory contents (`--all` to include hidden) |

### API Commands

| Command | Description | API Used |
|---|---|---|
| `mycli joke` | Fetch a random joke | Official Joke API |
| `mycli quote` | Fetch a random inspirational quote | Quotable API |
| `mycli weather <city>` | Current weather for any city | Open-Meteo (no key needed) |
| `mycli github <username>` | GitHub public profile info | GitHub REST API |
| `mycli crypto <coin>` | Live crypto price & market data | CoinGecko API |

### Utility Commands

| Command | Description |
|---|---|
| `mycli greet <name>` | Friendly greeting (`--shout` for uppercase) |
| `mycli time [timezone]` | Current date & time (supports IANA timezones) |
| `mycli uuid` | Generate a UUID v4 (`--count <n>` for multiple) |
| `mycli base64 encode <text>` | Encode text to Base64 |
| `mycli base64 decode <text>` | Decode Base64 back to text |
| `mycli password` | Generate a strong password (`--length <n>`, `--count <n>`) |

---


## Project Architecture

```
workshop_2/
├── src/
│   ├── commands/
│   │   ├── CommandHandler.ts    # Abstract base class
│   │   ├── MathCommands.ts      # Arithmetic operations
│   │   ├── FileCommands.ts      # File system utilities
│   │   ├── APICommands.ts       # External API integrations
│   │   └── UtilityCommands.ts   # General utilities
│   └── utils/
│       └── display.ts           # Colored output helpers
├── cli.ts                       # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

### OOP Design
- **`CommandHandler`** — Abstract base class with `register(program: Command): void`
- **`MathCommands`** — Extends `CommandHandler`, private `factorial()` helper method
- **`FileCommands`** — Extends `CommandHandler`, handles file I/O with flags
- **`APICommands`** — Extends `CommandHandler`, async API calls with spinners
- **`UtilityCommands`** — Extends `CommandHandler`, private `generatePassword()` helper

---

## APIs Used

| API | Endpoint | Key Required |
|---|---|---|
| [Official Joke API](https://official-joke-api.appspot.com/) | `/random_joke` | ❌ No |
| [Quotable](https://docs.quotable.io/) | `/random` | ❌ No |
| [Open-Meteo](https://open-meteo.com/) | Geocoding + Weather | ❌ No |
| [GitHub REST API](https://docs.github.com/en/rest) | `/users/{username}` | ❌ No |
| [CoinGecko API](https://www.coingecko.com/en/api) | `/simple/price` | ❌ No |

---