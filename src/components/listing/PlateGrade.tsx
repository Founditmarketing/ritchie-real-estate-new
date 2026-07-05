/**
 * The unified warm-dusk photographic grade (see DESIGN.md, Imagery).
 * Drop inside any relative overflow-hidden image container, after the
 * <Image> (which should also carry `saturate-[0.88]`): a navy bed rising
 * from the bottom plus the hero's sodium soft-light cast, so every photo
 * on the site reads as one world.
 */
export function PlateGrade() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink/40 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[oklch(0.65_0.12_36/0.10)] mix-blend-soft-light"
      />
    </>
  );
}
