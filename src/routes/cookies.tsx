import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell, Section } from "@/components/zelor/Page";

const categories = [
  {
    id: "necessaires",
    label: "Cookies nécessaires",
    body: "Indispensables au fonctionnement du site et du panier. Toujours actifs.",
    locked: true,
  },
  {
    id: "mesure",
    label: "Mesure d'audience",
    body: "Statistiques de fréquentation, désactivées par défaut.",
    locked: false,
  },
  {
    id: "marketing",
    label: "Marketing et publicité",
    body: "Personnalisation et campagnes, désactivées par défaut.",
    locked: false,
  },
];

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Préférences cookies — ZELOR" },
      {
        name: "description",
        content:
          "Gérez vos préférences de cookies sur le site ZELOR : mesure d'audience et marketing désactivés par défaut.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Préférences cookies — ZELOR" },
      {
        property: "og:description",
        content: "Gérez vos préférences de cookies sur le site ZELOR.",
      },
      { property: "og:url", content: "/cookies" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    necessaires: true,
    mesure: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <PageShell
      title="Préférences cookies"
      intro="Aucune mesure d'audience ni cookie marketing n'est activé sans votre accord."
      crumbs={[{ label: "Préférences cookies" }]}
    >
      <Section title="Catégories">
        <ul className="relief-z divide-y divide-border/70 overflow-hidden px-6">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-start justify-between gap-6 py-5"
            >
              <div>
                <p className="font-medium">{category.label}</p>
                <p className="text-sm text-muted-foreground">{category.body}</p>
              </div>
              <label className="chip-z press-z shrink-0 cursor-pointer gap-2 px-4 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={prefs[category.id]}
                  disabled={category.locked}
                  onChange={(event) => {
                    setPrefs((p) => ({
                      ...p,
                      [category.id]: event.target.checked,
                    }));
                    setSaved(false);
                  }}
                  className="size-4 rounded-full accent-[var(--navy)]"
                />
                <span>{prefs[category.id] ? "Activé" : "Désactivé"}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>
      <button type="button" onClick={() => setSaved(true)} className="btn-lux">
        Enregistrer mes préférences
      </button>
      {saved && (
        <p role="status" className="text-sm">
          Vos préférences ont été enregistrées.
        </p>
      )}
    </PageShell>
  );
}
