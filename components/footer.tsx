import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/metadata";

const footerNavigation = {
  atendimento: [
    { name: "Agendar Consulta", href: "/agendar" },
    { name: "Convênios Aceitos", href: "/convenios" },
    { name: "Perguntas Frequentes", href: "/faq" },
    { name: "Contato", href: "/contato" },
  ],
  especialidades: [
    { name: "Cardiologia Geral", href: "/especialidades/cardiologia" },
    { name: "Arritmologia", href: "/especialidades/arritmologia" },
    { name: "Eletrofisiologia", href: "/especialidades/eletrofisiologia" },
  ],
  institucional: [
    { name: "Sobre o Dr. Pedro Felipe", href: "/sobre" },
    { name: "Avaliações de Pacientes", href: "/avaliacoes" },
    { name: "Blog", href: "/blog" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">Dr. Pedro Felipe</span>
                <span className="text-xs text-primary-300">{siteConfig.doctor.crm}</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Atendimento
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerNavigation.atendimento.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-primary-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Especialidades
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerNavigation.especialidades.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-primary-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">
                  {siteConfig.doctor.address.street}
                  <br />
                  {siteConfig.doctor.address.neighborhood} — {siteConfig.doctor.address.city},{" "}
                  {siteConfig.doctor.address.state}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <a
                  href={`tel:${siteConfig.doctor.phone}`}
                  className="text-sm text-gray-400 hover:text-primary-300"
                >
                  {siteConfig.doctor.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <a
                  href={`mailto:${siteConfig.doctor.email}`}
                  className="text-sm text-gray-400 hover:text-primary-300"
                >
                  {siteConfig.doctor.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">
                  Segunda a Sexta, 8h às 18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} Dr. Pedro Felipe Prates Silva. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-600">
              {siteConfig.doctor.crm} · {siteConfig.doctor.rqe.join(" · ")}
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Conforme Resolução CFM 1.974/2011 e Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>
      </div>
    </footer>
  );
}
