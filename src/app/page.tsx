import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const levels = [
    { level: '100', title: '100 Level', description: 'First year students portal' },
    { level: '200', title: '200 Level', description: 'Second year students portal' },
    { level: '300', title: '300 Level', description: 'Third year students portal' },
    { level: '400', title: '400 Level', description: 'Final year students portal' },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNCAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative z-10 text-center">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Welcome to ASSON
          </h1>
          <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Association of Statistics Students Nigeria - Your hub for course materials, announcements, and academic resources.
          </p>
        </div>
      </section>

      <section>
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Select Your Level
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Choose your academic level to access relevant materials and updates
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {levels.map(({ level, title, description }) => (
            <Link key={level} href={`/level/${level}`}>
              <div className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-card p-6 sm:p-8 transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <span className="text-2xl font-bold text-primary">{level}</span>
                  </div>
                  <h3 className="font-headline text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
