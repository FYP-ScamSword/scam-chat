<!-- PROJECT LOGO -->
<!-- <h1 align="center">
  <a href="{project-url}">
    <img src="{project-logo}" alt="Logo" width="125" height="125">
  </a>
</h1> -->

<!-- TITLE -->
# Scam Chat

<!-- TABLE OF CONTENTS -->
## Table of contents

- [Scam Chat](#scam-chat)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Usage](#usage)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)

<!-- ABOUT -->
## About

Scam chat is a service that facilitates the sending and receiving messages for canary accounts accounts in order to enable pseudonymous online chats . It uses the [GramJS](https://github.com/gram-js/gramjs) client library to connect to [Telegram](https://telegram.org/)

## Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org/en/) (version 16 recommended)
- [MongoDB](https://www.mongodb.com/) instance

### Usage

#### Account API setup

- Navigate to `tests/telegram_api_demo` and follow the corresponding [README](./tests/telegram_api_demo/README.md)

#### Project setup

1. Run `npm install` for project dependencies
2. Create a `.env` file within the root directory to specify a MongoDB connection string and application port number
   - The MongoDB connection string can be local (`mongodb://localhost:27017`) or [remote](https://www.mongodb.com/docs/atlas/compass-connection/)
   - The port can any available local port number of choice. Generally, port numbers 808X are available.

```
MONGODB_CONNECTION=""
PORT=8081
```

3. Start the application locally with `npm run start`.

## Roadmap

TBA

## Contributing

NA

## License

See [LICENSE.md](LICENSE.md)
