const REPOSITORY_URL = 'https://github.com/UlissesNunes/synotheo';

export function HeroFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed inset-x-8 bottom-\\[26px] z-20 flex items-center justify-between max-md:inset-x-4 max-md:bottom-\\[18px]">
      <p className="label">© {year} SynoTheo</p>
      <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="label">
        GitHub
      </a>
    </footer>
  );
}
