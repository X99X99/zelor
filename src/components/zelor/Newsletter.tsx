import { useState } from "react";

import { Reveal } from "./Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <Reveal
      as="section"
      aria-labelledby="newsletter-title"
      className="container-z grid gap-x-8 gap-y-10 py-24 md:py-28 lg:grid-cols-2 lg:items-end"
    >
      <div>
        <p className="eyebrow text-navy-foreground/60">La lettre</p>
        <h2 id="newsletter-title" className="mt-3 font-display text-3xl md:text-4xl">
          Entrez dans l'univers ZELOR.
        </h2>
        <p className="mt-4 max-w-md text-sm text-navy-foreground/75">
          Le Journal, les nouveautés et nos sélections, réunis dans une lettre — pas plus souvent
          qu'il n'y a quelque chose à dire.
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
              className="w-full bg-transparent text-base text-navy-foreground outline-none placeholder:text-navy-foreground/60"
            />
          </div>
          <button type="submit" className="btn-veil shrink-0 px-8">
            Recevoir la lettre
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
          Vous pouvez vous désinscrire à tout moment. Vos données sont utilisées uniquement pour
          vous envoyer nos communications.
        </p>
      </form>
    </Reveal>
  );
}
