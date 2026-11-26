"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/content/site";
import styles from "./ContactSection.module.css";

type FormStatus = "idle" | "incomplete" | "ready";

const STATUS_MESSAGE: Record<Exclude<FormStatus, "idle">, string> = {
  incomplete: "Completa tu nombre y un correo o WhatsApp para poder responderte.",
  ready: "WhatsApp se abrió con el mensaje preparado. Revísalo y presiona Enviar allí.",
};

/**
 * Formulario de contacto que prepara un mensaje y lo abre en WhatsApp.
 */
export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("nombre") ?? "").trim();
    const contact = String(data.get("correo") ?? "").trim();
    if (!name || !contact) {
      setStatus("incomplete");
      return;
    }

    const interest = String(data.get("tipo") ?? "").trim();
    const message = String(data.get("mensaje") ?? "").trim();
    const whatsappMessage = [
      `Hola, soy ${name}.`,
      `Mi contacto es: ${contact}.`,
      `Me interesa: ${interest}.`,
      `Mi idea: ${message || "Aún no tengo detalles."}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setStatus("ready");
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.field}>
          Nombre
          <input name="nombre" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          Correo o WhatsApp
          <input name="correo" autoComplete="email" required />
        </label>
      </div>
      <label className={styles.field}>
        ¿Qué te interesa?
        <select name="tipo">
          {CONTACT.interests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        Tu idea en pocas palabras
        <textarea name="mensaje" placeholder={CONTACT.messagePlaceholder} />
      </label>
      <Button type="submit" className={styles.submit}>
        Enviar mensaje
      </Button>
      <p className={styles.note}>
        Al enviar, se abrirá WhatsApp con el mensaje listo. Reemplaza el número de ejemplo en CONTACT.whatsapp por el tuyo, con código de país y sin + ni espacios.
      </p>
      {status !== "idle" && (
        <p className={styles.status} role="status">
          {STATUS_MESSAGE[status]}
        </p>
      )}
    </form>
  );
}
