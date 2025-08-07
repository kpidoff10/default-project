import { redirect } from "next/navigation";

export default function Home() {
  // Rediriger vers la page avec locale par défaut (fr)
  redirect("/fr");
}
