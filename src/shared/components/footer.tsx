export function Footer() {
  return (
    <footer className=" bg-zinc-900 px-6 py-20">
      <p className="text-xs text-zinc-400 text-center">
        &copy; {new Date().getFullYear()} Panel Admin.
        {/* Todos los derechos reservados. */}
      </p>
    </footer>
  );
}
