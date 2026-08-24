import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell } from "@/components/zelor/Page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ZELOR" },
      {
        name: "description",
        content:
          "Contactez le service client ZELOR pour toute question sur une commande, un produit ou un retour.",
      },
      { property: "og:title", content: "Contact — ZELOR" },
      {
        property: "og:description",
        content: "Une question sur une commande, un produit ou un retour ?",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      title="Contact"
      intro="Nous répondons en français et en anglais. Précisez votre numéro de commande si vous en avez un."
      crumbs={[{ label: "Contact" }]}
      aside={
        <div className="rule-z space-y-2 pt-5">
          <p className="eyebrow">Service client</p>
          <p>
            Écrivez-nous par ce formulaire : chaque message est lu et reçoit une
            réponse, dans l'ordre d'arrivée.
          </p>
          <p className="text-muted-foreground">
            Du lundi au vendredi, en français et en anglais.
          </p>
        </div>
      }
    >
      <form
        noValidate
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const next: Record<string, string> = {};
          if (!String(data.get("nom") ?? "").trim())
            next["nom"] = "Indiquez votre nom.";
          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
              String(data.get("email") ?? "").trim(),
            )
          )
            next["email"] = "Indiquez une adresse email valide.";
          if (String(data.get("message") ?? "").trim().length < 10)
            next["message"] = "Votre message doit contenir au moins 10 caractères.";
          setErrors(next);
          setSent(Object.keys(next).length === 0);
        }}
      >
        {[
          { id: "nom", label: "Nom", type: "text", autoComplete: "name" },
          { id: "email", label: "Email", type: "email", autoComplete: "email" },
          {
            id: "commande",
            label: "Numéro de commande (facultatif)",
            type: "text",
            autoComplete: "off",
          },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={errors[field.id] ? true : undefined}
              aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
              className="input-z mt-2 min-h-12 w-full bg-transparent px-5 text-base text-foreground outline-none"
            />
            {errors[field.id] && (
              <p id={`${field.id}-error`} role="alert" className="mt-1 text-sm text-destructive">
                ⚠ {errors[field.id]}
              </p>
            )}
          </div>
        ))}
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            aria-invalid={errors["message"] ? true : undefined}
            aria-describedby={errors["message"] ? "message-error" : undefined}
            className="input-z mt-2 w-full rounded-2xl bg-transparent px-5 py-3 text-base text-foreground outline-none"
          />
          {errors["message"] && (
            <p id="message-error" role="alert" className="mt-1 text-sm text-destructive">
              ⚠ {errors["message"]}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn-lux"
        >
          Envoyer
        </button>
        {sent && (
          <p role="status" className="text-sm">
            Merci, votre message nous est bien parvenu. Nous vous répondrons
            dans les meilleurs délais.
          </p>
        )}
      </form>
    </PageShell>
  );
}
