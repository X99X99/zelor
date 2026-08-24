import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <section
      aria-labelledby="newsletter-title"
      className="container-z grid gap-8 py-16 lg:grid-cols-2 lg:items-end"
    >
      <div>
        <h2 id="newsletter-title" className="font-display text-3xl md:text-4xl">
          Entrez dans l'univers ZELOR.
        </h2>
        <p className="mt-3 max-w-md text-sm text-forest-foreground/75">
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
          <div className="flex-1">
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
              className="min-h-12 w-full border border-forest-foreground/30 bg-transparent px-4 text-base text-forest-foreground outline-none placeholder:text-forest-foreground/50 focus-visible:border-forest-foreground"
            />
          </div>
          <button
            type="submit"
            className="min-h-12 bg-background px-8 text-sm tracking-[0.14em] text-foreground uppercase transition-opacity hover:opacity-85"
          >
            S'inscrire
          </button>
        </div>
        {error && (
          <p
            id="newsletter-error"
            role="alert"
            className="mt-2 text-sm text-forest-foreground"
          >
            ⚠ {error}
          </p>
        )}
        {done && (
          <p role="status" className="mt-2 text-sm text-forest-foreground">
            Formulaire de démonstration : à connecter à Shopify Forms / Shopify
            Email avant publication. Aucune donnée n'est enregistrée.
          </p>
        )}
        <p className="mt-3 text-xs text-forest-foreground/60">
          Vous pouvez vous désinscrire à tout moment. Vos données sont utilisées
          uniquement pour vous envoyer nos communications.
        </p>
      </form>
    </section>
  );
}
