import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { getContactInfo, getPrimaryAddress } from "@/lib/data";
import { siteConfig } from "@/lib/metadata";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";

const footerNavigation = {
  atendimento: [
    { name: "Agendar Consulta", href: "/agendar", event: "agendar_click" as const },
    {
      name: "Segunda opinião",
      href: "/segunda-opiniao",
      event: "segunda_opiniao_click" as const,
    },
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

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

/** Exibe WhatsApp no formato BR: 5561996270787 → (61) 9 9627-0787 */
function formatWhatsAppDisplay(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("55")) {
    const ddd = digits.slice(2, 4);
    const nine = digits.slice(4, 5);
    const part1 = digits.slice(5, 9);
    const part2 = digits.slice(9);
    return `(${ddd}) ${nine} ${part1}-${part2}`;
  }
  return whatsapp;
}

function whatsappHref(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const [contact, address] = await Promise.all([
    getContactInfo(),
    getPrimaryAddress(),
  ]);

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">Dr. Pedro Felipe</span>
                <span className="text-xs text-primary-400">{siteConfig.doctor.crm}</span>
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
                  {"event" in item && item.event ? (
                    <TrackedLink
                      event={item.event}
                      href={item.href}
                      className="text-sm text-gray-400 transition-colors hover:text-primary-300"
                    >
                      {item.name}
                    </TrackedLink>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 transition-colors hover:text-primary-300"
                    >
                      {item.name}
                    </Link>
                  )}
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
                  {address.clinic_name}
                  <br />
                  {address.street}
                  <br />
                  {address.neighborhood} — {address.city}, {address.state}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <TrackedAnchor
                  event="phone_click"
                  href={telHref(contact.phone)}
                  className="text-sm text-gray-400 hover:text-primary-300"
                >
                  {contact.phone}
                </TrackedAnchor>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary-400" />
                <TrackedAnchor
                  event="whatsapp_click"
                  href={whatsappHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-primary-300"
                >
                  {formatWhatsAppDisplay(contact.whatsapp)}
                </TrackedAnchor>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <TrackedAnchor
                  event="email_click"
                  href={`mailto:${contact.email}`}
                  className="text-sm text-gray-400 hover:text-primary-300"
                >
                  {contact.email}
                </TrackedAnchor>
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
