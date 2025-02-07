# Suno Download Plugin

A browser extension that enhances the download experience for Suno AI's platform. This extension is compatible with both Chrome and Firefox browsers.

## Features

- Browser extension with popup interface
- Supports both Chrome (Manifest V3) and Firefox (Manifest V2)
- Download management functionality
- Active tab interaction
- Modern React-based UI

## Tech Stack

- React 18
- TypeScript
- Vite
- Web Extension API
- JSZip for file handling

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/suno-download-plugin.git
cd suno-download-plugin
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build the extension:
```bash
npm run build
```

5. Create distribution zip:
```bash
npm run zip
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the extension
- `npm run zip` - Create a distribution zip file
- `npm run lint` - Run ESLint with auto-fix
- `npm run prettier` - Format code with Prettier

## Browser Support

The extension is built to support:
- Chrome and Chromium-based browsers (Manifest V3)
- Firefox (Manifest V2)

## Permissions

The extension requires the following permissions:
- `activeTab` - To interact with the currently active tab
- `downloads` - To manage downloads
- `declarativeContent` - To control when the extension is active

## Project Structure

```
src/
├── background.ts    # Service worker background script
├── manifest.json    # Extension manifest
├── pages/          # React components and pages
├── popup.tsx       # Popup entry point
└── popup.html      # Popup HTML template
```

## Building for Production

1. Run the build command:
```bash
npm run build
```

2. Create a distribution zip:
```bash
npm run zip
```

The built extension will be available in the `dist` directory, and a `dist.zip` file will be created for distribution.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 