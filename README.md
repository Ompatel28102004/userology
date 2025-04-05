# Crypto Weather Nexus

A Next.js application that combines cryptocurrency and weather data into a unified dashboard experience.

## Features

- Real-time cryptocurrency price tracking
- Weather forecasts and current conditions
- Favorite cryptocurrency watchlist
- Responsive design with modern UI components

## Live Demo

👉 [Try it Live](https://userology-six.vercel.app/)
## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Redux
- **Authentication**: [Add authentication method if implemented]
- **Deployment**: Vercel

## Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Ompatel28102004/userology.git
cd crypto-weather-nexus
```

2. Install dependencies:

```bash
npm install --force
```

3. Create a `.env` file in the root directory and add your API keys:

```env
# Add your environment variables here
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_CRYPTO_API_KEY=your_crypto_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
crypto-weather-nexus/
├── app/                  # Next.js 14 app directory
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── redux/             # State management
└── styles/            # Global styles
```

## Development Decisions

- Implemented using the Next.js 14 App Router for better performance and server components
- Used Radix UI for accessible and customizable components
- Implemented Redux for global state management
- Utilized Tailwind CSS for responsive and maintainable styling

## Deployment

The application is deployed on Vercel. For deployment instructions:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy your application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
