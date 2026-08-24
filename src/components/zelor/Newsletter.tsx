import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <section
      aria-labelledby="newsletter-title"
      className="container-z grid gap-8 py-20 lg:grid-cols-2 lg:items-end"
    >
      <div>
        <h2 id="newsletter-title" className="font-display text-3xl md:text-4xl">
          Entrez dans l'univers ZELOR.
        </h2>
        <p className="mt-3 max-w-md text-sm text-navy-foreground/75">
          Recevez nos nouveautés, nos histoires et nos sélections directement
          dans votre boîte mail.
        </p>
      </div>
      <form
        noValidate
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
          if (!valid) {
            setError("Merci d'indiquer une adresse email valide.");
            setDone(false);
            return;
          }
          setError(null);
          setDone(true);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="input-z flex min-h-12 flex-1 items-center px-5 text-navy-foreground">
            <label htmlFor="newsletter-email" className="sr-only">
              Votre adresse email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "newsletter-error" : undefined}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Votre adresse email"
              className="w-full bg-transparent text-base text-navy-foreground outline-none placeholder:text-navy-foreground/50"
            />
          </div>
          <button
            type="submit"
            className="press-z min-h-12 shrink-0 rounded-full border border-navy-foreground/25 bg-navy-foreground/10 px-8 text-[0.8125rem] tracking-[0.16em] text-navy-foreground uppercase backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:-translate-y-px hover:border-navy-foreground/50 hover:bg-navy-foreground/18 hover:shadow-[var(--shadow-float)] active:translate-y-0 active:scale-[0.985]"
          >
            S'inscrire
          </button>
        </div>
        {error && (
          <p
            id="newsletter-error"
            role="alert"
            className="slide-up-lux mt-2 text-sm text-navy-foreground"
          >
            ⚠ {error}
          </p>
        )}
        {done && (
          <p role="status" className="slide-up-lux mt-2 text-sm text-navy-foreground">
            Merci — vous recevrez la lettre de la Maison ZELOR.
          </p>
        )}
        <p className="mt-3 text-xs text-navy-foreground/60">
          Vous pouvez vous désinscrire à tout moment. Vos données sont utilisées
          uniquement pour vous envoyer nos communications.
        </p>
      </form>
    </section>
  );
}
