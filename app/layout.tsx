import "./globals.css";

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <nav className="p-3 border-b flex flex-wrap gap-3 text-sm">
          <a href="/">Dashboard</a>
          <a href="/scan">Scanner</a>
          <a href="/plan">Plan</a>
          <a href="/plan7">+7</a>
          <a href="/quiz">Quiz</a>
          <a href="/eval">Evaluation</a>
          <a href="/rewards">Récompenses</a>
          <a href="/calendars">Calendriers</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
