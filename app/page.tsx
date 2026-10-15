import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page landing-page">
      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark"><Activity aria-hidden="true" size={22} /></span>
            <span>RE.HAB</span>
          </Link>
          <span className="pill green">Demo MVP</span>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">Percorso menisco · dati fittizi</p>
            <h1>Dal quadro clinico al feedback del paziente.</h1>
            <p className="lead">
              Una demo navigabile del flusso condiviso fra fisioterapista e paziente,
              costruita per validare il primo MVP di RE.HAB.
            </p>
            <Link className="button primary" href="/demo/menisco">
              Apri la demo <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <aside className="panel landing-note">
            <ShieldCheck aria-hidden="true" size={30} />
            <h2>Ambiente dimostrativo</h2>
            <p>I dati restano nel browser e possono essere ripristinati in qualsiasi momento.</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
