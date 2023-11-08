# Password Manager

This app is a secure password manager that uses the AES-256-GCM algorithm to encrypt your sensitive data before storing it locally. It offers strong encryption, user friendly features, quick access to all your accounts, and the ability to generate secure passwords.

To see the README in French, follow this link : [README.fr.md](README.fr.md)

## Features

- Encrypted data files using the AES-256-GCM algorithm
- Multiple user support with secure access
- Automatic logout after 15 minutes of inactivity
- Advanced password generator for strong and secure passwords
- Password strength indicator in forms
- Importing and exporting raw data to a CSV file
- Fast accounts search and actions improving the user experience

## Development

This project is written with TypeScript, React, and Material UI. The Web Crypto API is used for the secure data encryption, and Tauri is used for the lightweight and cross-platform desktop application support.

I appreciate your feedback if you would like to share your experience and report any issues.

## How to use it

### Option 1 : Download the installer

You can download the latest installer from [the latest release page](https://github.com/LaurentP/password-manager/releases).

This is a cross-platform desktop application. If you can't find the installer corresponding to your operating system, refer to option 2.

### Option 2 : Build from source code

#### 1. Configure your environment

Node.js is the required runtime environment to build the application. If you don't already have it installed on your computer, download it from [the website of Node.js](https://nodejs.org) before following the following steps.

In addition to Node.js, this project which uses Tauri also has additionnal prerequisites. Refer to [this page of the Tauri documentation](https://tauri.app/fr/v1/guides/getting-started/prerequisites) to configure your environment before continuing.

#### 2. Download the source code

Download the source code by either cloning the repository or downloading the ZIP file from the project's GitHub page. Then, in your terminal, make sure to navigate to the root of the project directory before using the following commands.

#### 3. Install the dependencies

```shell
npm install
```

#### 4. Build the application

```shell
npm run tauri build
```

This will generate the binary files corresponding to your operating system to install the application.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

The main icon of the app is from [Freepik](https://freepik.com).

## Screenshots

![Accounts](/screenshots/screenshot-1.png)
![Password Generator](/screenshots/screenshot-2.png)
![Settings](/screenshots/screenshot-3.png)
