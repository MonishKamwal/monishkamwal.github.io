export default function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built in public — every deploy, experiment and drift report is a
          public artifact.
        </p>
        <div className="flex gap-4">
          <a
            className="hover:text-accent"
            href="https://github.com/MonishKamwal"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="hover:text-accent"
            href="https://github.com/MonishKamwal/mlops"
            target="_blank"
            rel="noreferrer"
          >
            Platform repo
          </a>
          <a
            className="hover:text-accent"
            href="https://github.com/MonishKamwal/monishkamwal.github.io"
            target="_blank"
            rel="noreferrer"
          >
            Site source
          </a>
        </div>
      </div>
    </footer>
  );
}
