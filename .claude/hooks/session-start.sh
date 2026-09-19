#!/bin/bash
# Prépare une session Claude Code sur le web pour ZELOR.
#
# Deux obstacles propres à cet environnement, et rien d'autre :
#
# 1. `bun.lock` résout ses tarballs via le miroir npm privé de Lovable
#    (`*-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`). Ce miroir répond 403
#    hors du bac à sable Lovable : l'installation échoue avant d'avoir commencé.
#    On réécrit donc les URLs vers registry.npmjs.org **le temps de
#    l'installation seulement**. Les versions épinglées et les empreintes sha512
#    du verrou sont conservées telles quelles : mêmes paquets, même intégrité,
#    `--frozen-lockfile` reste exigé. Le fichier est restauré à l'identique
#    ensuite — un `bun.lock` réécrit qui partirait sur la branche casserait le
#    workflow `quality` et la synchronisation Lovable.
#
# 2. Le conteneur n'a pas d'IPv6, et la config Lovable fait écouter le serveur de
#    développement sur `::` : `vite dev` meurt en `EAFNOSUPPORT`, et avec lui le
#    `webServer` de Playwright. On publie la commande équivalente en IPv4, que
#    `playwright.config.ts` lit si elle est présente.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

# En local, `bun install` fonctionne tel quel : ce hook n'a rien à y faire.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

MIRROR_PATTERN='https://europe-west[0-9]*-npm\.pkg\.dev/lovable-core-prod/sandbox-npm-cache/'
LOCK_BACKUP="$(mktemp)"

restore_lock() {
  if [ -s "$LOCK_BACKUP" ]; then
    cp "$LOCK_BACKUP" bun.lock
  fi
  rm -f "$LOCK_BACKUP"
}
trap restore_lock EXIT

if grep -q 'pkg\.dev' bun.lock 2>/dev/null; then
  cp bun.lock "$LOCK_BACKUP"
  sed -i "s#${MIRROR_PATTERN}#https://registry.npmjs.org/#g" bun.lock
  echo "bun.lock : miroir Lovable réécrit vers registry.npmjs.org (restauré après l'installation)."
fi

bun install --frozen-lockfile

restore_lock
trap - EXIT

# Garde-fou : la branche ne doit jamais repartir avec un verrou réécrit.
if ! git diff --quiet -- bun.lock; then
  echo "ERREUR : bun.lock n'a pas retrouvé son état d'origine." >&2
  git checkout -- bun.lock
  exit 1
fi

# Serveur de développement en IPv4 (voir le point 2 ci-dessus).
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo 'export ZELOR_DEV_COMMAND="bunx vite dev --host 127.0.0.1 --port 8080"'
    echo 'export ZELOR_DEV_URL="http://127.0.0.1:8080"'
    # Le Chromium de l'image n'est pas celui que `@playwright/test` attend :
    # sans ce chemin, les parcours échouent au lancement du navigateur.
    if [ -x /opt/pw-browsers/chromium ]; then
      echo 'export ZELOR_CHROMIUM_FALLBACK="/opt/pw-browsers/chromium"'
    fi
  } >> "$CLAUDE_ENV_FILE"
fi

# Le catalogue vient de Shopify. Ses identifiants ne sont pas dans le dépôt :
# sans eux, les pages catalogue attendent une réponse qui ne viendra pas, puis
# affichent « catalogue à venir ». Mieux vaut le savoir avant de conclure à une
# régression.
if ! grep -q '^SHOPIFY_STOREFRONT_TOKEN=' .env 2>/dev/null; then
  echo "Note : aucun identifiant Shopify dans .env — le catalogue restera vide,"
  echo "et les pages qui l'interrogent mettront ~20 s à s'afficher (attente de la requête)."
fi

echo "Environnement prêt : bun run lint | typecheck | test | build."
echo "Parcours navigateur : bun run test:e2e (la suite visuelle est écartée, voir ci-dessous)."
echo "Le verrou de rendu exige Chromium 146.x (tests/e2e/browser-lock.json) ; l'image en fournit un plus ancien,"
echo "donc les captures de référence ne sont pas comparables ici. Les régénérer depuis une"
echo "session web produirait de fausses baselines : ne le faire que sur la machine de référence."
