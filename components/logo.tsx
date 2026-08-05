import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Bingo Show - início">
      <span className="brand-star">★</span>
      <span className="brand-lines">
        <strong>BINGO</strong>
        <em>SHOW</em>
      </span>
      <span className="brand-star right">★</span>
    </Link>
  );
}
