import { useEffect, useRef } from "react";

/**
 * Rend le focus au déclencheur lorsqu'un panneau se ferme.
 *
 * Sans cela, un visiteur au clavier qui ouvre le menu puis le referme perd sa
 * position : le focus retombe au début du document et il doit tout reparcourir.
 * C'est le défaut le plus courant des panneaux faits à la main, et il ne se
 * voit jamais à la souris.
 *
 * On mémorise l'élément réellement actif au moment de l'ouverture plutôt qu'une
 * référence au bouton : un même panneau peut être ouvert depuis plusieurs
 * endroits, et c'est là où l'on était qu'il faut revenir.
 *
 * La capture se fait pendant le rendu, et c'est délibéré. React exécute les
 * effets des composants enfants avant ceux du parent : un panneau qui prend
 * lui-même le focus — la recherche place le curseur dans son champ — l'aurait
 * déjà déplacé quand l'effet du parent s'exécute, et l'on mémoriserait le
 * champ au lieu du bouton. Or ce champ est démonté à la fermeture, donc le
 * focus ne reviendrait nulle part. Au rendu, la mise à jour du DOM n'a pas
 * encore eu lieu : l'élément actif est encore le déclencheur.
 *
 * Trois précautions à la restitution :
 * — `isConnected`, sinon on donnerait le focus à un nœud démonté et le
 *   navigateur le renverrait au corps du document ;
 * — `preventScroll`, sinon le retour du focus fait sauter la page ;
 * — aucun état React, donc aucun rendu déclenché et aucune boucle possible.
 */
export function useFocusReturn(open: boolean) {
  const trigger = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  if (open && !wasOpen.current && typeof document !== "undefined") {
    const active = document.activeElement;
    trigger.current = active instanceof HTMLElement ? active : null;
  }
  wasOpen.current = open;

  useEffect(() => {
    if (open) return;

    const node = trigger.current;
    trigger.current = null;
    if (node?.isConnected) node.focus({ preventScroll: true });
  }, [open]);
}
