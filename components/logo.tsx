import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Bingo Show - início">
      <img
        src="/theme-bingo-show/logos/logo-main.png"
        alt="Bingo Show"
        style={{ height: "115px", width: "auto", maxWidth: "100%" }}
      />
    </Link>
  );
}
